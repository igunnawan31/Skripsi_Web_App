import { OmitType } from "@nestjs/mapped-types";
import { AgendaFreq, AgendaStatus } from "@prisma/client";
import { IsDate, IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

export class CreateAgendaDTO {
  @IsString()
  title: string;

  @IsDateString()
  eventDate: string;

  @IsString()
  timezone: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsEnum(AgendaFreq)
  @IsOptional()
  frequency?: AgendaFreq;
}

export class InternalCreateAgendaDTO extends OmitType(CreateAgendaDTO, ['eventDate']) {
  @IsDate()
  eventDate: Date;
}
