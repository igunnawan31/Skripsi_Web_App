import { OmitType } from '@nestjs/mapped-types';
import { StatusIndikatorKPI } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class EvalMapDTO {
  @IsString()
  evaluatorId: string;

  @IsArray()
  @IsString({ each: true })
  evaluateeId: string[];
}

export class CreateIndikatorDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsBoolean()
  statusPublic: boolean;

  @IsEnum(StatusIndikatorKPI)
  status: StatusIndikatorKPI;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvalMapDTO)
  @IsOptional()
  evalMap?: EvalMapDTO[];
}

export class InternalCreateIndikatorDTO extends OmitType(CreateIndikatorDTO, [
  'startDate',
  'endDate',
  'evalMap',
]) {
  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsString()
  createdById: string;
}

export class InternalCreateEvaluationsDTO {
  @IsString()
  indikatorId: string;

  @IsString()
  evaluatorId: string;

  @IsString()
  evaluateeId: string;
}
