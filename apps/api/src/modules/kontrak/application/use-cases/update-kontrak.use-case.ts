import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InternalUpdateKontrakDTO } from '../dtos/request/update-kontrak.dto';
import { deleteFileArray, deleteFileArrayString } from 'src/common/utils/fileHelper';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { IKontrakRepository } from '../../domain/repositories/kontrak.repository.interface';
import { KontrakValidationService } from '../../domain/services/kontrak-validation.service';
import { KontrakPaymentUpdatedEvent } from '../events/kontrak.events';
import { LoggerService } from 'src/modules/logger/logger.service';
import { DeleteManySalariesUseCase } from 'src/modules/salary/application/use-cases/delete-many-salaries.use-case';
import { RetrieveKontrakResponseDTO } from '../dtos/response/read-response.dto';

@Injectable()
export class UpdateKontrakUseCase {
  constructor(
    @Inject(IKontrakRepository)
    private readonly kontrakRepo: IKontrakRepository,
    private readonly validationService: KontrakValidationService,
    private readonly deleteManySalaryUseCase: DeleteManySalariesUseCase,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: LoggerService,
  ) { }
  async execute(
    kontrakId: string,
    dto: InternalUpdateKontrakDTO,
    user: UserRequest,
  ) {
    try {
      const oldKontrak = await this.kontrakRepo.findById(kontrakId);

      if (!oldKontrak) {
        throw new NotFoundException('Kontrak tidak ditemukan');
      }

      // Date-related
      const startDate: Date = dto.startDate ?? new Date(oldKontrak.startDate);
      const endDate: Date = dto.endDate ?? new Date(oldKontrak.endDate);
      const oldStartDate: Date = new Date(oldKontrak.startDate);
      const oldEndDate: Date = new Date(oldKontrak.endDate);
      const datesChanged =
        (dto.startDate && oldStartDate.getTime() !== startDate.getTime()) ||
        (dto.endDate && oldEndDate.getTime() !== endDate.getTime());
      if (datesChanged)
        this.validationService.assertValidDates(startDate, endDate);

      // Salary-related
      const paymentChanged = this.hasPaymentChanged(oldKontrak, dto);
      const totalChanged =
        !!dto.totalBayaran && oldKontrak.totalBayaran !== dto.totalBayaran;

      if (paymentChanged) {
        this.validationService.assertValidTerminPercentage(
          dto.metodePembayaran ?? oldKontrak.metodePembayaran,
          dto.dpPercentage ?? oldKontrak.dpPercentage,
          dto.finalPercentage ?? oldKontrak.finalPercentage,
        );
      }

      // Docs-related
      const oldDocs = oldKontrak.documents ?? [];
      const newDocs = dto.documents ?? [];
      const removePaths = new Set(
        (dto.removeDocuments ?? []).filter((p) =>
          oldDocs.some((d) => d.path === p),
        ),
      );
      const remainingDocs = [
        ...oldDocs.filter((d) => !removePaths.has(d.path)),
        ...newDocs,
      ];

      // Update query
      const updatedKontrak = await this.kontrakRepo.update(kontrakId, {
        ...dto,
        startDate,
        endDate,
        documents: remainingDocs,
      });

      // handles salary changes on kontrak
      if (paymentChanged || totalChanged) {
        await this.deleteManySalaryUseCase.execute(
          oldKontrak.userId,
          kontrakId,
        );
        this.eventEmitter.emit(
          'kontrak.created',
          new KontrakPaymentUpdatedEvent(
            updatedKontrak.id,
            updatedKontrak.userId,
            updatedKontrak.projectId,
            dto.totalBayaran ?? oldKontrak.totalBayaran,
            dto.metodePembayaran ?? oldKontrak.metodePembayaran,
            dto.startDate ?? oldStartDate,
            dto.endDate ?? oldEndDate,
            dto.dpPercentage,
            dto.finalPercentage,
          ),
        );
      }

      await deleteFileArrayString([...removePaths], 'Dokumen Kontrak');
      return updatedKontrak;
    } catch (err) {
      if (dto.documents) {
        await deleteFileArray(dto.documents, 'Dokumen Kontrak');
      }
      this.logger.error(err);
      throw err;
    }
  }

  private hasPaymentChanged(
    oldKontrak: RetrieveKontrakResponseDTO,
    dto: InternalUpdateKontrakDTO,
  ): boolean {
    return (
      (!!dto.metodePembayaran &&
        oldKontrak.metodePembayaran !== dto.metodePembayaran) ||
      (!!dto.dpPercentage && oldKontrak.dpPercentage !== dto.dpPercentage) ||
      (!!dto.finalPercentage &&
        oldKontrak.finalPercentage !== dto.finalPercentage)
    );
  }
}
