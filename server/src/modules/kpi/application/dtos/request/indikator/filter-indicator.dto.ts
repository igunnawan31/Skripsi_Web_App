import { StatusIndikatorKPI } from "@prisma/client";
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { FilterDTO } from "src/common/types/Filter.dto";

export class IndikatorFilterDTO extends FilterDTO {
  @IsString()
  @IsOptional()
  category: string;

  @IsDateString()
  @IsOptional()
  minStartDate: string;

  @IsDateString()
  @IsOptional()
  maxEndDate: string;

  @IsBoolean()
  @IsOptional()
  statusPublic: boolean;

  @IsEnum(StatusIndikatorKPI)
  @IsOptional()
  status: StatusIndikatorKPI;
}
