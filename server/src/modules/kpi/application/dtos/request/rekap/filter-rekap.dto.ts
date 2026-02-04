import { IsNumber, IsOptional } from 'class-validator';
import { FilterDTO } from 'src/common/types/Filter.dto';

export class RekapFilterDTO extends FilterDTO {
  @IsOptional()
  @IsNumber()
  minTotalNilai: number;

  @IsOptional()
  @IsNumber()
  maxTotalNilai: number;

  @IsOptional()
  @IsNumber()
  minRataRata: number;

  @IsOptional()
  @IsNumber()
  maxRataRata: number;
}
