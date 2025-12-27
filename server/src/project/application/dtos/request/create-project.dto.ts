import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsDate, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { FileMetaData } from 'src/common/types/FileMetaData.dto';

export class CreateProjectDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

export class InternalCreateProjectDTO extends OmitType(CreateProjectDTO, [
  'startDate',
  'endDate',
]) {
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsOptional()
  dokumen?: FileMetaData[];
}
