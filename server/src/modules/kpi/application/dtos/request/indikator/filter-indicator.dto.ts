import { OmitType } from "@nestjs/mapped-types";
import { StatusIndikatorKPI } from "@prisma/client";
import { IsBoolean, IsDate, IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { FilterDTO } from "src/common/types/Filter.dto";

export class IndikatorFilterDTO extends FilterDTO {
  @IsString()
  @IsOptional()
  category?: string;

  @IsDateString()
  @IsOptional()
  minStartDate?: string;

  @IsDateString()
  @IsOptional()
  maxEndDate?: string;

  @IsBoolean()
  @IsOptional()
  statusPublic?: boolean;

  @IsEnum(StatusIndikatorKPI)
  @IsOptional()
  status?: StatusIndikatorKPI;
}

export class InternalIndikatorFilterDTO extends OmitType(IndikatorFilterDTO, ['minStartDate', 'maxEndDate']) {
  @IsDate()
  @IsOptional()
  minStartDate?: Date;

  @IsDate()
  @IsOptional()
  maxEndDate?: Date;
}
