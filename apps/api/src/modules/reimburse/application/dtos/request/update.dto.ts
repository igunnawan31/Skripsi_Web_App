import { IsEnum, IsOptional, IsString } from 'class-validator';
import { InternalCreateReimburseDTO } from './create.dto';
import { ApprovalStatus } from 'src/generated/prisma/enums';
import { PartialType } from '@nestjs/mapped-types';

export class InternalUpdateReimburseDTO extends PartialType(InternalCreateReimburseDTO) { 
  @IsString()
  approverId: string;

  @IsEnum(ApprovalStatus)
  approvalStatus: ApprovalStatus; 

  @IsOptional()
  @IsString()
  notes?: string;
}
