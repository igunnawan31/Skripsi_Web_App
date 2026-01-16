import { IsEnum, IsOptional, IsString } from 'class-validator';
import { InternalCreateReimburseDTO } from './create.dto';
import { ApprovalStatus } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';

export class InternalUpdateReimburseDTO extends PartialType(InternalCreateReimburseDTO) { 
  @IsOptional()
  @IsString()
  approverId?: string;

  @IsOptional()
  @IsEnum(ApprovalStatus)
  approvalStatus?: ApprovalStatus; 

  @IsOptional()
  @IsString()
  notes?: string;
}
