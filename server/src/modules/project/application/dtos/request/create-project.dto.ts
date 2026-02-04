import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsDate, IsDateString, IsDefined, IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
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

export class ProjectProvisionInputDTO {
  @IsOptional()
  @IsString()
  id?: string; // in case bikin project dulu baru bikin kontrak
  
  @ValidateIf(o => !o.id)
  @IsString()
  @IsDefined()
  name: string;

  @ValidateIf(o => !o.id)
  @IsString()
  @IsDefined()
  description: string;

  @ValidateIf(o => !o.id)
  @IsDefined()
  @IsDate()
  startDate: Date;

  @ValidateIf(o => !o.id)
  @IsDefined()
  @IsDate()
  endDate: Date;

  @IsOptional()
  documents?: FileMetaData[];
}

export class ProjectTeamProvisionInputDTO {
  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  projectId: string;
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
  documents?: FileMetaData[];
}
