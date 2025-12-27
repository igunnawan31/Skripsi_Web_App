import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProjectDTO } from './create-project.dto';
import { IsArray, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { ProjectStatus } from '@prisma/client';
import { FileMetaData } from 'src/common/types/FileMetaData.dto';
import { Type } from 'class-transformer';

export class UpdateProjectDTO extends PartialType(CreateProjectDTO) {
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsArray()
  @IsOptional()
  removeDokumen?: string[];
}
export class InternalUpdateProjectDTO extends OmitType(UpdateProjectDTO, [
  'startDate',
  'endDate',
] as const) {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @IsOptional()
  dokumen?: FileMetaData[];
}
