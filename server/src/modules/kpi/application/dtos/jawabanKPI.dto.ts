import { Expose } from "class-transformer";

export class JawabanKPIBaseDTO {
  @Expose()
  id: string;

  @Expose()
  indikatorId: string;

  @Expose()
  pertanyaanId: string;

  @Expose()
  penilaiId: string;

  @Expose()
  dinilaiId: string;

  @Expose()
  nilai: number;

  @Expose()
  notes?: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
