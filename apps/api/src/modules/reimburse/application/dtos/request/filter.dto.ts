import { OmitType } from '@nestjs/mapped-types';
import { ApprovalStatus } from '@prisma/client';
import { IsDate, IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { FilterDTO } from 'src/common/types/Filter.dto';

export class ReimburseFilterDTO extends FilterDTO {
  @IsInt()
  @IsOptional()
  minExpenses?: number;

  @IsInt()
  @IsOptional()
  maxExpenses?: number;

  @IsDateString()
  @IsOptional()
  minSubmittedDate?: string;

  @IsDateString()
  @IsOptional()
  maxSubmittedDate?: string;

  @IsOptional()
  @IsEnum(ApprovalStatus)
  approvalStatus?: ApprovalStatus;
}

export class InternalReimburseFilterDTO extends OmitType(ReimburseFilterDTO, ['minSubmittedDate', 'maxSubmittedDate']) {
  @IsDate()
  @IsOptional()
  minSubmittedDate?: Date;

  @IsDate()
  @IsOptional()
  maxSubmittedDate?: Date;
}
