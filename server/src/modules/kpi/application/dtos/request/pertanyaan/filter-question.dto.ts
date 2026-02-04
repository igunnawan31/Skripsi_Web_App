import { KategoriPertanyaan } from "@prisma/client";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { FilterDTO } from "src/common/types/Filter.dto";

export class PertanyaanFilterDTO extends FilterDTO {
  @IsEnum(KategoriPertanyaan)
  @IsOptional()
  kategori: KategoriPertanyaan;

  @IsBoolean()
  @IsOptional()
  aktif: boolean;
}
