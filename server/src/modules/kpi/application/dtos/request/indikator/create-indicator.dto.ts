import { OmitType } from "@nestjs/mapped-types";
import { StatusIndikatorKPI } from "@prisma/client";
import { IsBoolean, IsDate, IsDateString, IsEnum, IsString } from "class-validator";

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
}

export class InternalCreateIndikatorDTO extends OmitType(CreateIndikatorDTO, ['startDate', 'endDate']){
  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsString()
  createdById: string;
}
