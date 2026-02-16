import { KategoriPertanyaan } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FilterDTO } from 'src/common/types/Filter.dto';

export class PertanyaanFilterDTO extends FilterDTO {
  @IsEnum(KategoriPertanyaan)
  @IsOptional()
  kategori?: KategoriPertanyaan;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  aktif?: boolean;

  @IsOptional()
  @IsNumber()
  bobot?: number;
}
