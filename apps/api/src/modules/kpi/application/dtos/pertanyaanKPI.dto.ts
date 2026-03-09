import { KategoriPertanyaan } from "src/generated/prisma/enums";
import { Expose } from "class-transformer";

export class PertanyaanKPIBaseDTO {
  @Expose()
  id: string;

  @Expose()
  indikatorId: string;

  @Expose()
  kategori: KategoriPertanyaan;

  @Expose()
  pertanyaan: string;

  @Expose()
  bobot: number;

  @Expose()
  aktif: boolean;

  @Expose()
  urutanSoal: number;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
