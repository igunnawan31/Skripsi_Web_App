import { StatusCuti } from "@prisma/client";
import { IsDateString, IsEnum, IsOptional } from "class-validator";
import { FilterDTO } from "src/shared/dtos/Filter.dto";

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
