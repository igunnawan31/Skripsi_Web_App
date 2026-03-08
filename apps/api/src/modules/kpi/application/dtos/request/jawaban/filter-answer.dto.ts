import { OmitType } from "@nestjs/mapped-types";
import { IsDate, IsDateString, IsNumber, IsOptional } from "class-validator";
import { FilterDTO } from "src/common/types/Filter.dto";

export class JawabanFilterDTO extends FilterDTO {
  @IsOptional()
  @IsNumber()
  maxGrade?: number;

  @IsOptional()
  @IsNumber()
  minGrade?: number;

  @IsOptional()
  @IsDateString()
  minCreatedDate?: string;

  @IsOptional()
  @IsDateString()
  maxCreatedDate?: string;
}
export class InternalJawabanFilterDTO extends OmitType(JawabanFilterDTO, ['minCreatedDate', 'maxCreatedDate']) {
  @IsOptional()
  @IsDate()
  minCreatedDate?: Date;

  @IsOptional()
  @IsDate()
  maxCreatedDate?: Date;
}
