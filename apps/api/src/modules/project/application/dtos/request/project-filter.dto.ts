import { ProjectStatus } from "src/generated/prisma/enums";
import { IsDateString, IsEnum, IsOptional } from "class-validator";
import { FilterDTO } from "src/common/types/Filter.dto";

export class ProjectFilterDTO extends FilterDTO {
  @IsOptional()
  @IsDateString()
  minStartDate?: string;

  @IsOptional()
  @IsDateString()
  maxEndDate?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;
}
