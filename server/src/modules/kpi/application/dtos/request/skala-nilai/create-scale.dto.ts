import { ValueType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsString } from "class-validator";

export class CreateNilaiDTO {
  @IsString()
  name: string;

  @IsEnum(ValueType)
  valueType: ValueType;

  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  valueRange: string[];
}
