import { GajiStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { FilterDTO } from 'src/common/types/Filter.dto';

export class GajiFilterDTO extends FilterDTO {
  @IsEnum(GajiStatus)
  @IsOptional()
  status?: GajiStatus;

  @IsDateString()
  @IsOptional()
  minDueDate?: string;

  @IsDateString()
  @IsOptional()
  maxDueDate?: string;

  @IsString()
  @IsOptional()
  sortBy?: SortByOptions = 'createdAt';
}

export type SortByOptions = 'createdAt' | 'periode' | 'dueDate' | 'amount';
