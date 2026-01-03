import { GajiStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGajiDTO {
  @IsString()
  userId: string;

  @IsString()
  kontrakId: string;

  @IsDateString()
  periode: string;

  @IsDateString()
  dueDate: string;

  @IsEnum(GajiStatus)
  status: GajiStatus;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;
}
