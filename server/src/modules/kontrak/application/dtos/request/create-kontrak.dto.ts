import { BadRequestException } from '@nestjs/common';
import { OmitType } from '@nestjs/mapped-types';
import {
  EmployeeType,
  KontrakKerjaStatus,
  MetodePembayaran,
} from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FileMetaData } from 'src/common/types/FileMetaData.dto';
import { ProjectProvisionInputDTO } from 'src/modules/project/application/dtos/request/create-project.dto';
import { UserProvisionInputDTO } from 'src/modules/users/application/dtos/request/create-user.dto';

class BaseCreateKontrakDTO {
  @IsEnum(MetodePembayaran)
  metodePembayaran: MetodePembayaran;

  @IsNumber()
  @IsOptional()
  @Type(()=>Number)
  dpPercentage?: number;

  @IsNumber()
  @IsOptional()
  @Type(()=>Number)
  finalPercentage?: number;

  @IsNumber()
  @Type(()=>Number)
  totalBayaran: number;

  @IsNumber()
  @Type(()=>Number)
  absensiBulanan: number;

  @IsNumber()
  @Type(()=>Number)
  cutiBulanan: number;

  @IsEnum(KontrakKerjaStatus)
  @IsOptional()
  status?: KontrakKerjaStatus;

  @IsString()
  @IsOptional()
  catatan?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(EmployeeType)
  jenis: EmployeeType;
}

export class CreateKontrakDTO extends BaseCreateKontrakDTO {
  @IsNotEmptyObject()
  @Type(() => UserProvisionInputDTO)
  @Transform(({ value }): UserProvisionInputDTO => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        throw new BadRequestException('userData must be a valid JSON string');
      }
    }
    return value;
  })
  userData: UserProvisionInputDTO;

  @IsOptional()
  @Type(() => ProjectProvisionInputDTO)
  @Transform(({ value }): ProjectProvisionInputDTO => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        throw new BadRequestException('projectData must be a valid JSON string');
      }
    }
    return value;
  })
  projectData: ProjectProvisionInputDTO;
}

export class InternalCreateKontrakDTO extends OmitType(BaseCreateKontrakDTO, ['startDate', 'endDate']) {
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ValidateNested()
  @Type(() => UserProvisionInputDTO)
  userData: UserProvisionInputDTO;

  @ValidateNested()
  @Type(() => ProjectProvisionInputDTO)
  projectData: ProjectProvisionInputDTO;

  @ValidateNested()
  @Type(() => FileMetaData)
  documents: FileMetaData[];
}
