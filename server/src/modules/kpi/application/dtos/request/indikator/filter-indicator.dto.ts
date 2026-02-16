import { BadRequestException } from '@nestjs/common';
import { OmitType } from '@nestjs/mapped-types';
import { StatusIndikatorKPI } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { FilterDTO } from 'src/common/types/Filter.dto';

export class IndikatorFilterDTO extends FilterDTO {
  @IsDateString()
  @IsOptional()
  minStartDate?: string;

  @IsDateString()
  @IsOptional()
  maxEndDate?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    throw new BadRequestException('statusPublic must be true or false');
  })
  statusPublic?: boolean;

  @IsEnum(StatusIndikatorKPI)
  @IsOptional()
  status?: StatusIndikatorKPI;
}

export class InternalIndikatorFilterDTO extends OmitType(IndikatorFilterDTO, [
  'minStartDate',
  'maxEndDate',
]) {
  @IsDate()
  @IsOptional()
  minStartDate?: Date;

  @IsDate()
  @IsOptional()
  maxEndDate?: Date;
}
