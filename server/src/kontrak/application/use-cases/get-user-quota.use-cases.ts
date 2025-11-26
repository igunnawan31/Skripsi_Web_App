import { Injectable, Inject } from '@nestjs/common';
import { IAbsensiRepository } from 'src/absensi/domain/repositories/absensi.repository.interface';
import { ICutiRepository } from 'src/cuti/domain/repositories/cuti.repository.interface';
import { IKontrakRepository } from 'src/kontrak/domain/repositories/kontrak.repository.interface';

export interface UserQuotaResponse {
  userId: string;
  periode: { year: number; month: number };
  cuti: {
    totalQuota: number;
    used: number;
    remaining: number;
  };
  absensi: {
    totalQuota: number;
    used: number;
    remaining: number;
  };
}

@Injectable()
export class GetUserQuotaUseCase {
  constructor(
    @Inject(IKontrakRepository)
    private readonly kontrakRepo: IKontrakRepository,
    @Inject(ICutiRepository)
    private readonly cutiRepo: ICutiRepository,
    @Inject(IAbsensiRepository)
    private readonly absensiRepo: IAbsensiRepository,
  ) {}

  async execute(userId: string, year?: number, month?: number): Promise<UserQuotaResponse> {
    const now = new Date();
    const targetYear = year || now.getFullYear();
    const targetMonth = month || now.getMonth() + 1;

    const [cutiQuota, absensiQuota] = await Promise.all([
      this.kontrakRepo.getTotalCutiQuota(userId),
      this.kontrakRepo.getTotalAbsensiQuota(userId),
    ]);

    const [usedCuti, usedAbsensi] = await Promise.all([
      this.cutiRepo.countUsedCuti(userId, targetYear, targetMonth),
      this.absensiRepo.countAbsensiInMonth(userId, targetYear, targetMonth),
    ]);

    return {
      userId,
      periode: { year: targetYear, month: targetMonth },
      cuti: {
        totalQuota: cutiQuota,
        used: usedCuti,
        remaining: cutiQuota - usedCuti,
      },
      absensi: {
        totalQuota: absensiQuota,
        used: usedAbsensi,
        remaining: absensiQuota - usedAbsensi,
      },
    };
  }
}
