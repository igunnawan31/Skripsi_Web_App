import { OmitType } from '@nestjs/mapped-types';
import { AgendaFreq, AgendaStatus } from '@prisma/client';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { FilterDTO } from 'src/common/types/Filter.dto';

export class AgendaFilterDTO extends FilterDTO {
  @IsOptional()
  @IsString()
  minEventDate?: string;

  @IsOptional()
  @IsString()
  maxEventDate?: string;

  @IsOptional()
  @IsEnum(AgendaStatus)
  status?: AgendaStatus;

  @IsOptional()
  @IsEnum(AgendaFreq)
  frequency?: AgendaFreq;
}

export class InternalAgendaFilterDTO extends OmitType(AgendaFilterDTO, ['minEventDate', 'maxEventDate']) {
  @IsOptional()
  @IsDate()
  minEventDate?: Date;

  @IsOptional()
  @IsDate()
  maxEventDate?: Date;
}
