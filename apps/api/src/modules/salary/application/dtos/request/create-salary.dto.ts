import {
    IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FileMetaData } from 'src/common/types/FileMetaData.dto';

export class CreateSalaryDTO {
  @IsString()
  userId: string;

  @IsString()
  kontrakId: string;

  @IsDateString()
  periode: string;

  @IsDate()
  dueDate: Date;

  @IsNumber()
  amount: number;
}
