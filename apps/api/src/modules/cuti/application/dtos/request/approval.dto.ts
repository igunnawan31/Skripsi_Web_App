import { StatusCuti } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ApprovalCutiDTO {
  // cuma kepake buat cancel
  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  catatan?: string;
}

// internal dto
export interface ApprovalCutiInput extends ApprovalCutiDTO {
  status: StatusCuti;
}

