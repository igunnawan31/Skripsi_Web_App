import { Expose } from "class-transformer";

export class RekapKPIBaseDTO {
  @Expose()
  id: string;

  @Expose()
  indikatorId: string;

  @Expose()
  userId: string;

  @Expose()
  totalNilai: number;

  @Expose()
  rataRata: number;

  @Expose()
  jumlahPenilai: number;

  @Expose()
  keterangan?: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
