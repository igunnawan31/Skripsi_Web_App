import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateCutiResponseDTO } from '../dtos/response/create-response.dto';
import { CreateCutiDTO } from '../dtos/request/create-cuti.dto';
import { CutiSubmittedEvent } from '../events/cuti.events';
import { FileMetaData } from 'src/common/types/FileMetaData.dto';
import { ICutiRepository } from '../../domain/repositories/cuti.repository.interface';
import { IUserRepository } from 'src/modules/users/domain/repositories/users.repository.interface';
import { CutiQuotaService } from '../../domain/services/cuti-quota.service';

@Injectable()
export class SubmitCutiUseCase {
  constructor(
    @Inject(ICutiRepository)
    private readonly cutiRepo: ICutiRepository,
    @Inject(IUserRepository)
    private readonly userRepo: IUserRepository,
    private readonly quotaService: CutiQuotaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    userId: string,
    dto: CreateCutiDTO,
    dokumenCuti: FileMetaData,
  ): Promise<CreateCutiResponseDTO> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const formattedStartDate = new Date(dto.startDate);
    const formattedEndDate = new Date(dto.endDate);

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

    const hasOverlap = await this.cutiRepo.checkOverlap(
      userId,
      formattedStartDate,
      formattedEndDate
    );
    if (hasOverlap) {
      throw new BadRequestException(
        'Tanggal cuti overlap dengan cuti yang sudah ada',
      );
    }

    const crossMonthCheck = await this.quotaService.checkCrossMonthCuti(
      formattedStartDate,
      formattedEndDate
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
  
    // let approver;
    // if (user.minorRole === MinorRole.HR){
    //   approver = await this.userRepo.
    // } else {
    //
    // }

    const cuti = await this.cutiRepo.create({
      userId,
      startDate: dto.startDate,
      endDate: dto.endDate,
      reason: dto.reason,
      dokumenCuti: dokumenCuti ?? undefined, 
    });

    this.eventEmitter.emit(
      'cuti.submitted',
      new CutiSubmittedEvent(
        cuti.id,
        userId,
        user.name,
        formattedStartDate,
        formattedEndDate,
      ),
    );

    return cuti;
  }
}
