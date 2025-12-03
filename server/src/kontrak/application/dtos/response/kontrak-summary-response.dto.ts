import { Expose } from 'class-transformer';

export class UserQuotaResponseDTO {
  @Expose()
  userId: string;
  @Expose()
  periode: { year: number; month: number };
  @Expose()
  cuti: {
    totalQuota: number;
    used: number;
    remaining: number;
  };
  @Expose()
  absensi: {
    totalQuota: number;
    used: number;
    remaining: number;
  };
}
