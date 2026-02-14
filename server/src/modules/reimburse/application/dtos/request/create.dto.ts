import { Type } from "class-transformer";
import { IsArray, IsInt, IsNumber, IsString, Min } from "class-validator";
import { FileMetaData } from "src/common/types/FileMetaData.dto";

export class CreateReimburseDTO { 
  @IsString()
  title: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  totalExpenses: number;
}

export class InternalCreateReimburseDTO extends CreateReimburseDTO {
  @IsArray()
  documents: FileMetaData[]

  @IsString()
  userId: string;
}
