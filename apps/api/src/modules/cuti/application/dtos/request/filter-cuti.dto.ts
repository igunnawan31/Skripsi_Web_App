import { StatusCuti } from "src/generated/prisma/enums";
import { IsDateString, IsEnum, IsOptional } from "class-validator";
import { FilterDTO } from "src/common/types/Filter.dto";

export class CutiFilterDTO extends FilterDTO {
  @IsOptional()
  @IsDateString()
  minStartDate: string;

  @IsOptional()
  @IsDateString()
  maxEndDate: string;

  @IsOptional()
  @IsEnum(StatusCuti)
  status: StatusCuti;
}
