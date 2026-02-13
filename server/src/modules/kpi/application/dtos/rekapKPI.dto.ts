import { Expose } from "class-transformer";

export class RekapKPIBaseDTO {
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
}
