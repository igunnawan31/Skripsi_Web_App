import { WorkStatus } from "@prisma/client";
import { IsEnum, IsInt, IsOptional } from "class-validator";
import { FilterDTO } from "src/common/types/Filter.dto";

export class AbsensiFilterDTO extends FilterDTO {
  @IsEnum(WorkStatus)
  @IsOptional()
  status: WorkStatus;

  @IsInt()
  @IsOptional()
  year: number;

  @IsInt()
  @IsOptional()
  month: number;
}
