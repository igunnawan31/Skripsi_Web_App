import { KontrakKerjaStatus, MetodePembayaran } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FilterDTO } from 'src/common/types/Filter.dto';

export class KontrakFilterDTO extends FilterDTO {
  @IsEnum(MetodePembayaran)
  @IsOptional()
  metodePembayaran?: MetodePembayaran;

  @IsEnum(KontrakKerjaStatus)
  @IsOptional()
  status?: KontrakKerjaStatus;

  @IsNumber()
  @IsOptional()
  minBayaran?: number;

  @IsNumber()
  @IsOptional()
  maxBayaran?: number;

  @IsNumber()
  @IsOptional()
  minAbsensi?: number;

  @IsNumber()
  @IsOptional()
  maxAbsensi?: number;

  @IsNumber()
  @IsOptional()
  minCuti?: number;

  @IsNumber()
  @IsOptional()
  maxCuti?: number;

  @IsDateString()
  @IsOptional()
  minStartDate?: string;

  @IsDateString()
  @IsOptional()
  maxEndDate?: string;

  @IsOptional()
  @IsString()
  sortBy?: SortByOptions = 'createdAt';
}

export type SortByOptions =
  | 'createdAt'
  | 'startDate'
  | 'endDate'
  | 'cutiBulanan'
  | 'absensiBulanan'
  | 'totalBayaran'
  | 'dpPercentage'
  | 'finalPercentage';
