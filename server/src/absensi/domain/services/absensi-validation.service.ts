import { Injectable, Inject } from '@nestjs/common';
import { WorkStatus } from '@prisma/client';
import { IKontrakRepository } from 'src/kontrak/domain/repositories/kontrak.repository.interface';

@Injectable()
export class AbsensiValidationService {
  constructor(
    @Inject(IKontrakRepository)
    private readonly kontrakRepo: IKontrakRepository,
  ) {}

  async validateMonthlyQuota(userId: string, date: Date, usedAbsensi: number): Promise<{
    valid: boolean;
    message: string;
    remainingQuota: number;
  }> {
    // Get monthly quota from active contracts
    const monthlyQuota = await this.kontrakRepo.getTotalAbsensiQuota(userId);

    if (monthlyQuota === 0) {
      return {
        valid: false,
        message: 'Tidak memiliki quota absensi (tidak ada kontrak aktif)',
        remainingQuota: 0,
      };
    }

    const remainingQuota = monthlyQuota - usedAbsensi;

    if (remainingQuota <= 0) {
      return {
        valid: false,
        message: `Quota absensi bulan ini sudah habis. Quota: ${monthlyQuota}, Terpakai: ${usedAbsensi}`,
        remainingQuota: 0,
      };
    }

    return {
      valid: true,
      message: 'Quota mencukupi',
      remainingQuota: remainingQuota - 1,
    };
  }

  validateWorkStatus(workStatus: WorkStatus, address?: string, latitude?: string, longitude?: string): {
    valid: boolean;
    message: string;
  } {
    if (workStatus === WorkStatus.WFO || workStatus === WorkStatus.HYBRID) {
      if (!address || !latitude || !longitude) {
        return {
          valid: false,
          message: 'Lokasi wajib diisi untuk WFO/HYBRID',
        };
      }
    }

    return { valid: true, message: 'Work status valid' };
  }

  validateCheckInTime(date: Date): { valid: boolean; message: string; isLate: boolean } {
    const hour = date.getHours();
    const minute = date.getMinutes();

    // Business rule: Check-in before 09:00 is on-time
    if (hour < 9 || (hour === 9 && minute === 0)) {
      return {
        valid: true,
        message: 'Check-in tepat waktu',
        isLate: false,
      };
    }

    return {
      valid: true,
      message: `Terlambat ${hour - 9} jam ${minute} menit`,
      isLate: true,
    };
  }
}
