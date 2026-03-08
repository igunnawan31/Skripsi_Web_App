import { WorkStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsOptional } from "class-validator";
import { FilterDTO } from "src/common/types/Filter.dto";

export class AbsensiFilterDTO extends FilterDTO {
  @IsEnum(WorkStatus)
  @IsOptional()
  status: WorkStatus;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  year: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  month: number;

  @IsOptional()
  @IsDateString()
  date: string;
}
