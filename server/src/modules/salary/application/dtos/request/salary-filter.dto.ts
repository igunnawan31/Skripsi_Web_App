import { SalaryStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { FilterDTO } from 'src/common/types/Filter.dto';

export class SalaryFilterDTO extends FilterDTO {
  @IsEnum(SalaryStatus)
  @IsOptional()
  status?: SalaryStatus;

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
