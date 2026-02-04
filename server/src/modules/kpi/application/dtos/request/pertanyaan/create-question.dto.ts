import { KategoriPertanyaan } from "@prisma/client";
import { IsBoolean, IsEnum, IsNumber, IsString } from "class-validator";

export class CreatePertanyaanDTO {
  @IsEnum(KategoriPertanyaan)
  kategori: KategoriPertanyaan;

  @IsString()
  pertanyaan: string;

  @IsNumber()
  bobot: number;

  @IsBoolean()
  aktif: boolean;

  @IsNumber()
  skalaId: number;

  @IsNumber()
  urutanSoal: number;
}
