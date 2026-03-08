import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateAgendaDTO, InternalCreateAgendaDTO } from './create.dto';
import { IsBoolean, IsDate, IsDateString, IsOptional } from 'class-validator';

export class UpdateAgendaDTO extends PartialType(CreateAgendaDTO) { }

export class InternalUpdateAgendaDTO extends PartialType(
  InternalCreateAgendaDTO,
) { }

export class UpdateAgendaOccurrenceDTO {
  @IsOptional()
  @IsBoolean()
  isCancelled?: boolean;

  @IsOptional()
  @IsDateString()
  date?: string;
}

export class InternalUpdateAgendaOccurrenceDTO extends OmitType(
  UpdateAgendaOccurrenceDTO,
  ['date'],
) {
  @IsOptional()
  @IsDate()
  date?: Date;
}
