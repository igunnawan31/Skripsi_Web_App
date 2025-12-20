import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IAbsensiRepository } from 'src/absensi/domain/repositories/absensi.repository.interface';
import { AbsensiValidationService } from 'src/absensi/domain/services/absensi-validation.service';
import { IUserRepository } from 'src/users/domain/repositories/users.repository.interface';
import { CheckInResponseDTO } from '../dtos/response/create-response.dto';
import { AbsensiCheckedInEvent } from '../events/absensi.events';
import { CheckInDTO } from '../dtos/request/check-in.dto';
import { EmployeeType, MinorRole } from '@prisma/client';

@Injectable()
export class CheckInUseCase {
  constructor(
    @Inject(IAbsensiRepository)
    private readonly absensiRepo: IAbsensiRepository,
    @Inject(IUserRepository)
    private readonly userRepo: IUserRepository,
    private readonly validationService: AbsensiValidationService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async execute(userId: string, dto: CheckInDTO): Promise<CheckInResponseDTO> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existing = await this.absensiRepo.findByUserAndDate(userId, today);
    if (existing) {
      throw new BadRequestException('Anda sudah check-in hari ini');
    }
    const workStatusValidation = this.validationService.validateWorkStatus(
      dto.workStatus,
      dto.address,
      dto.latitude,
      dto.longitude,
    );
    if (!workStatusValidation.valid) {
      throw new BadRequestException(workStatusValidation.message);
    }

    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    if (user.employeeType === EmployeeType.CONTRACT) {
      const usedAbsensi = await this.absensiRepo.countAbsensiInMonth(
        userId,
        year,
        month,
      );

      const quotaValidation = await this.validationService.validateMonthlyQuota(
        userId,
        today,
        usedAbsensi,
      );
      if (!quotaValidation.valid) {
        throw new BadRequestException(quotaValidation.message);
      }
    }

    const now = new Date();
    const timeValidation = this.validationService.validateCheckInTime(now);
    const absensi = await this.absensiRepo.checkIn({
      userId,
      date: today,
      workStatus: dto.workStatus,
      checkIn: now,
      address: dto.address,
      latitude: dto.latitude,
      longitude: dto.longitude,
    });

    // STEP 7: Emit event
    this.eventEmitter.emit(
      'absensi.checkedIn',
      new AbsensiCheckedInEvent(
        userId,
        today,
        dto.workStatus,
        timeValidation.isLate,
      ),
    );

    return absensi;
  }
}
