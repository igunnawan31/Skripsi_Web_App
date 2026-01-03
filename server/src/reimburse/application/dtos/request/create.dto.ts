import { IsArray, IsInt, IsString, Min } from "class-validator";
import { FileMetaData } from "src/common/types/FileMetaData.dto";

export class CreateReimburseDTO { 
  @IsString()
  title: string;

  @IsInt()
  @Min(0)
  totalExpenses: number;
}

export class InternalCreateReimburseDTO extends CreateReimburseDTO {
  @IsArray()
  documents: FileMetaData[]

  @IsString()
  userId: string;
}
