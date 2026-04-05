import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InternalUpdateKontrakDTO } from '../dtos/request/update-kontrak.dto';
import { deleteFileArray } from 'src/common/utils/fileHelper';
import { FileMetaData } from 'src/common/types/FileMetaData.dto';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { IKontrakRepository } from '../../domain/repositories/kontrak.repository.interface';
import { KontrakValidationService } from '../../domain/services/kontrak-validation.service';
import { KontrakPaymentUpdatedEvent } from '../events/kontrak.events';
import { LoggerService } from 'src/modules/logger/logger.service';
import { DeleteManySalariesUseCase } from 'src/modules/salary/application/use-cases/delete-many-salaries.use-case';

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

      const startDate: Date = dto.startDate ?? new Date(oldKontrak.startDate);
      const endDate: Date = dto.endDate ?? new Date(oldKontrak.endDate);
      const oldStartDate: Date = new Date(oldKontrak.startDate);
      const oldEndDate: Date = new Date(oldKontrak.endDate);
      if (
        (dto.startDate && oldStartDate !== dto.startDate) ||
        (dto.endDate && oldEndDate !== dto.endDate)
      ) {
        this.validationService.assertValidDates(startDate, endDate);
      }

      if (
        (dto.metodePembayaran &&
          oldKontrak.metodePembayaran !== dto.metodePembayaran) ||
        (dto.dpPercentage && oldKontrak.dpPercentage !== dto.dpPercentage) ||
        (dto.finalPercentage &&
          oldKontrak.finalPercentage !== dto.finalPercentage)
      ) {
        const metodePembayaran =
          dto.metodePembayaran ?? oldKontrak.metodePembayaran;
        const dpPercentage = dto.dpPercentage ?? oldKontrak.dpPercentage;
        const finalPercentage =
          dto.finalPercentage ?? oldKontrak.finalPercentage;

        this.validationService.assertValidTerminPercentage(
          metodePembayaran,
          dpPercentage,
          finalPercentage,
        );
      }

      let remainingDocs: FileMetaData[] = [];
      if (dto.documents) {
        const oldDocs = oldKontrak.documents ?? [];
        const newDocs = dto.documents ?? [];
        const removeDocs = dto.removeDocuments ?? [];

        const validRemoveDocs = oldDocs
          .filter((d) => removeDocs.includes(d.path))
          .map((d) => d.path);

        remainingDocs = oldDocs.filter(
          (d) => !validRemoveDocs.includes(d.path),
        );
        remainingDocs = [...remainingDocs, ...newDocs];
      }

      const payload: InternalUpdateKontrakDTO = {
        ...dto,
        startDate,
        endDate,
        documents: remainingDocs,
      };

      await this.deleteManySalaryUseCase.execute(oldKontrak.userId, kontrakId);

      const updatedKontrak = await this.kontrakRepo.update(kontrakId, payload);

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
      return updatedKontrak;
    } catch (err) {
      if (dto.documents) {
        await deleteFileArray(dto.documents, 'Dokumen Kontrak');
      }
      this.logger.error(err);
      throw err;
    }
  }
}
