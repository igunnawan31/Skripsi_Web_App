import { Injectable, Inject } from '@nestjs/common';
import { IKontrakRepository } from 'src/kontrak/domain/repositories/kontrak.repository.interface';

@Injectable()
export class CutiQuotaService {
  constructor(
    @Inject(IKontrakRepository)
    private readonly kontrakRepo: IKontrakRepository,
  ) {}

  async validateMonthlyQuota(
    userId: string,
    startDate: Date,
    endDate: Date,
    usedCutiDays: number,
  ): Promise<{ valid: boolean; message: string; remainingQuota: number }> {
    const requestedDays = this.calculateDays(startDate, endDate);
    const monthlyQuota = await this.kontrakRepo.getTotalCutiQuota(userId);

    if (monthlyQuota === 0) {
      return {
        valid: false,
        message: 'Tidak memiliki quota cuti (tidak ada kontrak aktif)',
        remainingQuota: 0,
      };
    }

    const remainingQuota = monthlyQuota - usedCutiDays;

    if (requestedDays > remainingQuota) {
      return {
        valid: false,
        message: `Quota cuti bulan ini tidak cukup. Tersedia: ${remainingQuota} hari, Diminta: ${requestedDays} hari`,
        remainingQuota,
      };
    }

    return {
      valid: true,
      message: 'Quota mencukupi',
      remainingQuota: remainingQuota - requestedDays,
    };
  }

  async checkCrossMonthCuti(
    startDate: Date,
    endDate: Date,
  ): Promise<{
    isCrossMonth: boolean;
    months: Array<{ year: number; month: number; days: number }>;
  }> {
    const months: Array<{ year: number; month: number; days: number }> = [];

    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const monthEnd = new Date(year, month, 0); // Last day of month
      const rangeEnd =
        currentDate.getMonth() === end.getMonth() ? end : monthEnd;

      const days =
        Math.ceil(
          (rangeEnd.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
        ) + 1;

      months.push({ year, month, days });

      currentDate = new Date(year, month, 1);
    }

    return {
      isCrossMonth: months.length > 1,
      months,
    };
  }

  private calculateDays(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
}
