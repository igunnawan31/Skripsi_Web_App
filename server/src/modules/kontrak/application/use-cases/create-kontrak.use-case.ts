import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { KontrakKerjaStatus } from '@prisma/client';
import { InternalCreateKontrakDTO } from '../dtos/request/create-kontrak.dto';
import { CreateKontrakResponseDTO } from '../dtos/response/create-response.dto';
import { plainToClass } from 'class-transformer';
import { KontrakCreatedEvent } from '../events/kontrak.events';
import { deleteFile, deleteFileArray } from 'src/common/utils/fileHelper';
import { RollbackManager } from 'src/common/utils/rollbackManager';
import { IKontrakRepository } from '../../domain/repositories/kontrak.repository.interface';
import { KontrakValidationService } from '../../domain/services/kontrak-validation.service';
import { ProjectProvisionService } from 'src/modules/project/application/services/project-provisioning.services';
import { UserProvisionService } from 'src/modules/users/application/services/user-provisioning.service';
import { ProjectBaseDTO } from 'src/modules/project/application/dtos/base.dto';

@Injectable()
export class CreateKontrakUseCase {
  constructor(
    @Inject(IKontrakRepository)
    private readonly kontrakRepo: IKontrakRepository,
    private readonly validationService: KontrakValidationService,
    private readonly eventEmitter: EventEmitter2,
    private readonly projectProvision: ProjectProvisionService,
    private readonly userProvision: UserProvisionService,
  ) { }

  async execute(
    dto: InternalCreateKontrakDTO,
    createdBy: string,
  ): Promise<CreateKontrakResponseDTO> {
    const rollback = new RollbackManager();
    try {
      this.validationService.assertValidDates(
        new Date(dto.startDate),
        new Date(dto.endDate),
      );

      this.validationService.assertValidTerminPercentage(
        dto.metodePembayaran,
        dto.dpPercentage,
        dto.finalPercentage,
      );

      const user = await this.userProvision.resolve(dto.userData, rollback);

      let project: ProjectBaseDTO | undefined;
      if (dto.jenis === 'CONTRACT') {
        project = await this.projectProvision.resolve(
          dto.projectData,
          rollback,
        );
      } else {
        // CONTRACT, BUT USER PROVIDED PROJECT DOCUMENT HENCE SHOULD BE CLEANED UP
        if (dto.projectData.documents) {
          await deleteFileArray(dto.projectData.documents, 'Dokumen Proyek');
        }
      }

      const kontrakData: InternalCreateKontrakDTO = plainToClass(
        InternalCreateKontrakDTO,
        {
          userData: user,
          projectData: project ? project : null,
          metodePembayaran: dto.metodePembayaran,
          dpPercentage: dto.dpPercentage,
          finalPercentage: dto.finalPercentage,
          totalBayaran: dto.totalBayaran,
          absensiBulanan: dto.absensiBulanan,
          cutiBulanan: dto.cutiBulanan,
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
          catatan: dto.catatan,
          status: KontrakKerjaStatus.ACTIVE,
          documents: dto.documents,
        },
      );

      const kontrak = await this.kontrakRepo.create(kontrakData);

      this.eventEmitter.emit(
        'kontrak.created',
        new KontrakCreatedEvent(
          kontrak.id,
          kontrak.userId,
          kontrak.projectId,
          dto.cutiBulanan,
          dto.absensiBulanan,
          dto.totalBayaran,
          dto.metodePembayaran,
          dto.startDate,
          dto.endDate,
          createdBy,
          dto.dpPercentage,
          dto.finalPercentage,
        ),
      );

      return kontrak;
    } catch (err) {
      await rollback.rollback();
      throw err;
    }
  }
}
