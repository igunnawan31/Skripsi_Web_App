import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { FileMetaData } from "src/common/types/FileMetaData.dto";

export class CheckOutDTO {
}

export class InternalCheckOutDTO extends CheckOutDTO {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  photo: FileMetaData[];

  @IsDate()
  date: Date;
}
