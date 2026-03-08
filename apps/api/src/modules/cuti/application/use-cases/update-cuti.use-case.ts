import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeleteCutiResponseDTO } from '../dtos/response/delete-response.dto';
import { UpdateCutiDTO } from '../dtos/request/update-cuti.dto';
import { FileMetaData } from 'src/common/types/FileMetaData.dto';
import { deleteFile } from 'src/common/utils/fileHelper';
import { ICutiRepository } from '../../domain/repositories/cuti.repository.interface';
import { IUserRepository } from 'src/modules/users/domain/repositories/users.repository.interface';
import { CutiQuotaService } from '../../domain/services/cuti-quota.service';
import { CutiAuthorizationService } from '../../domain/services/cuti-approval-authorization.service';

@Injectable()
export class UpdateCutiUseCase {
  constructor(
    @Inject(ICutiRepository)
    private readonly cutiRepo: ICutiRepository,
    @Inject(IUserRepository)
    private readonly userRepo: IUserRepository,
    private readonly quotaService: CutiQuotaService,
    private readonly authzService: CutiAuthorizationService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async execute(
    cutiId: string,
    userId: string,
    dto: UpdateCutiDTO,
    file: FileMetaData,
  ): Promise<DeleteCutiResponseDTO> {
    const cuti = await this.cutiRepo.findById(cutiId);
    if (!cuti) {
      throw new NotFoundException('Cuti tidak ditemukan');
    }
    let formattedStartDate: Date;
    let formattedEndDate: Date;
    if (dto.startDate) {
      formattedStartDate = new Date(dto.startDate);
    } else {
      formattedStartDate = new Date(cuti.startDate);
    }
    if (dto.endDate) {
      formattedEndDate = new Date(dto.endDate);
    } else {
      formattedEndDate = new Date(cuti.endDate);
    }
    if (formattedStartDate > formattedEndDate) {
      throw new BadRequestException(
        'Tanggal mulai tidak boleh lebih besar dari tanggal selesai',
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (formattedStartDate < today) {
      throw new BadRequestException(
        'Tidak dapat mengajukan cuti untuk tanggal yang sudah lewat',
      );
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }
    if (user.id !== cuti.userId) {
      throw new UnauthorizedException(
        'User tidak memiliki akses untuk memperbarui data cuti ini',
      );
    }

    if (cuti.status === 'MENUNGGU') {
      if (file) {
        await deleteFile(cuti.dokumen.path);
      }
      const hasOverlap = await this.cutiRepo.checkOverlap(
        userId,
        formattedStartDate,
        formattedEndDate,
      );
      if (hasOverlap) {
        throw new BadRequestException(
          'Tanggal cuti overlap dengan cuti yang sudah ada',
        );
      }

      const crossMonthCheck = await this.quotaService.checkCrossMonthCuti(
        formattedStartDate,
        formattedEndDate,
      );

      if (crossMonthCheck.isCrossMonth) {
        for (const monthData of crossMonthCheck.months) {
          const usedCuti = await this.cutiRepo.countUsedCutiDays(
            userId,
            monthData.year,
            monthData.month,
          );

          const validation = await this.quotaService.validateMonthlyQuota(
            userId,
            new Date(monthData.year, monthData.month - 1, 1),
            new Date(monthData.year, monthData.month - 1, monthData.days),
            usedCuti,
          );

          if (!validation.valid) {
            throw new BadRequestException(
              `Quota tidak cukup untuk bulan ${monthData.month}/${monthData.year}. ${validation.message}`,
            );
          }
        }
      } else {
        const year = formattedStartDate.getFullYear();
        const month = formattedStartDate.getMonth() + 1;
        const usedCuti = await this.cutiRepo.countUsedCutiDays(
          userId,
          year,
          month,
        );

        const validation = await this.quotaService.validateMonthlyQuota(
          userId,
          formattedStartDate,
          formattedEndDate,
          usedCuti,
        );

        if (!validation.valid) {
          throw new BadRequestException(validation.message);
        }
      }
      const updatedCuti = await this.cutiRepo.update(cutiId, dto, file);
      // this.eventEmitter.emit(
      //   'cuti.updated',
      //   new CutiUpdatedEvent(updatedCuti.id, cuti.userId, user.id, dto.reason),
      // );

      return updatedCuti;
    } else {
      throw new BadRequestException('Cuti tidak dapat diperbarui');
    }
  }
}
