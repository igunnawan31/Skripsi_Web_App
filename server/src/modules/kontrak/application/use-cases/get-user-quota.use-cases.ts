import { Injectable, Inject } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserQuotaResponseDTO } from '../dtos/response/kontrak-summary-response.dto';
import { IKontrakRepository } from '../../domain/repositories/kontrak.repository.interface';
import { ICutiRepository } from 'src/modules/cuti/domain/repositories/cuti.repository.interface';
import { IAbsensiRepository } from 'src/modules/absensi/domain/repositories/absensi.repository.interface';

@Injectable()
export class GetUserQuotaUseCase {
  constructor(
    @Inject(IKontrakRepository)
    private readonly kontrakRepo: IKontrakRepository,
    @Inject(ICutiRepository)
    private readonly cutiRepo: ICutiRepository,
    @Inject(IAbsensiRepository)
    private readonly absensiRepo: IAbsensiRepository,
  ) { }

  async execute(
    userId: string,
    year?: number,
    month?: number,
  ): Promise<UserQuotaResponseDTO> {
    const now = new Date();
    const targetYear = year || now.getFullYear();
    const targetMonth = month || now.getMonth() + 1;

    const [cutiQuota, absensiQuota] = await Promise.all([
      this.kontrakRepo.getTotalCutiQuota(userId),
      this.kontrakRepo.getTotalAbsensiQuota(userId),
    ]);

    const [usedCuti, usedAbsensi] = await Promise.all([
      this.cutiRepo.countUsedCutiDays(userId, targetYear, targetMonth),
      this.absensiRepo.countAbsensiInMonth(userId, targetYear, targetMonth),
    ]);

    return plainToInstance(UserQuotaResponseDTO, {
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
    });
  }
}
