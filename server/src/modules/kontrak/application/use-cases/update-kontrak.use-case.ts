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

@Injectable()
export class UpdateKontrakUseCase {
  constructor(
    @Inject(IKontrakRepository)
    private readonly kontrakRepo: IKontrakRepository,
    private readonly validationService: KontrakValidationService,
    private readonly eventEmitter: EventEmitter2,
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

      let startDate: Date = dto.startDate ?? new Date(oldKontrak.startDate);
      let endDate: Date = dto.endDate ?? new Date(oldKontrak.endDate);
      if (
        (dto.startDate && new Date(oldKontrak.startDate) !== dto.startDate) ||
        (dto.endDate && new Date(oldKontrak.endDate) !== dto.endDate)
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
        console.log('old: ', oldDocs);
        console.log('new: ', newDocs);
        console.log('remove: ', removeDocs);
        console.log('remaining: ', remainingDocs);
      }

      console.log('payload: ', remainingDocs);
      const payload: InternalUpdateKontrakDTO = {
        ...dto,
        startDate,
        endDate,
        documents: remainingDocs,
      };
      console.log('payload: ', payload);

      const updatedKontrak = await this.kontrakRepo.update(kontrakId, payload);

      return updatedKontrak;
    } catch (err) {
      if (dto.documents) {
        await deleteFileArray(dto.documents, 'Dokumen Kontrak');
      }
    }
  }
}
