import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { FileMetaData } from "src/common/types/FileMetaData.dto";

export class CheckOutDTO {
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class InternalCheckOutDTO extends CheckOutDTO {
  @IsNotEmpty()
  photo: FileMetaData[];

  @IsDate()
  date: Date;
}
