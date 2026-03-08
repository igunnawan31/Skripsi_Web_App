import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSalaryDTO } from './create-salary.dto';
import { IsDate, IsEnum, ValidateNested } from 'class-validator';
import { FileMetaData } from 'src/common/types/FileMetaData.dto';
import { Type } from 'class-transformer';
import { SalaryStatus } from '@prisma/client';

export class UpdateSalaryDTO extends PartialType(
  OmitType(CreateSalaryDTO, ['kontrakId', 'userId']),
) {
}
export class InternalUpdateSalaryDTO extends UpdateSalaryDTO {
  @IsEnum(SalaryStatus)
  status: SalaryStatus; 

  @ValidateNested()
  @Type(() => FileMetaData)
  paychecks: FileMetaData[];

  @IsDate()
  paymentDate: Date;
}
