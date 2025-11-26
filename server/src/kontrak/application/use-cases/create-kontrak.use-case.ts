import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { KontrakKerjaStatus } from '@prisma/client';
import { IKontrakRepository } from 'src/kontrak/domain/repositories/kontrak.repository.interface';
import { KontrakValidationService } from 'src/kontrak/domain/services/kontrak-validation.service';
import { IUserRepository } from 'src/users/domain/repositories/users.repository.interface';
import { CreateKontrakDTO } from '../dtos/request/create-kontrak.dto';
import { CreateKontrakResponseDTO } from '../dtos/response/create-response.dto';
import { plainToClass } from 'class-transformer';
import { UserBaseDTO } from 'src/users/application/dtos/base.dto';
import { ProjectBaseDTO } from 'src/project/application/dtos/base.dto';
import { KontrakCreatedEvent } from '../events/kontrak.events';

@Injectable()
export class CreateKontrakUseCase {
  constructor(
    @Inject(IKontrakRepository)
    private readonly kontrakRepo: IKontrakRepository,
    @Inject(IUserRepository)
    private readonly userRepo: IUserRepository,
    @Inject(IProjectRepository)
    private readonly projectRepo: IProjectRepository,
    private readonly validationService: KontrakValidationService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async execute(
    dto: CreateKontrakDTO,
    createdBy: string,
  ): Promise<CreateKontrakResponseDTO> {
    const dateValidation = this.validationService.validateDates(
      new Date(dto.tanggalMulai),
      new Date(dto.tanggalSelesai),
    );
    if (!dateValidation.valid) {
      throw new BadRequestException(dateValidation.message);
    }

    const percentageValidation =
      this.validationService.validateTerminPercentage(
        dto.metodePembayaran,
        dto.dpPercentage,
        dto.finalPercentage,
      );
    if (!percentageValidation.valid) {
      throw new BadRequestException(percentageValidation.message);
    }

    let user: UserBaseDTO;
    if (dto.userData.id) {
      user = await this.userRepo.findById(dto.userData.id);
    } else {
      user = await this.userRepo.create(dto.userData);
    }

    let project: ProjectBaseDTO;
    if (dto.projectData.id) {
      project = await this.projectRepo.findById(dto.projectData.id);
    } else {
      project = await this.projectRepo.create(dto.projectData);
    }

    const kontrakData: CreateKontrakDTO = plainToClass(CreateKontrakDTO, {
      userId: user.id,
      projectId: project.id,
      metodePembayaran: dto.metodePembayaran,
      dpPercentage: dto.dpPercentage,
      finalPercentage: dto.finalPercentage,
      totalBayaran: dto.totalBayaran,
      absensiBulanan: dto.absensiBulanan,
      cutiBulanan: dto.cutiBulanan,
      tanggalMulai: dto.tanggalMulai,
      tanggalSelesai: dto.tanggalSelesai,
      catatan: dto.catatan,
      status: KontrakKerjaStatus.AKTIF,
    });

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
        dto.tanggalMulai,
        dto.tanggalSelesai,
        createdBy,
        dto.dpPercentage,
        dto.finalPercentage
      ),
    );

    return kontrak;
  }
}
