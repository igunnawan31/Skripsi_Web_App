import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { FileMetaData } from "src/common/types/FileMetaData.dto";

export class CreateCutiDTO {
  @IsString()
  userId: string;

  @IsDateString()
  startDate: string;
  
  @IsDateString()
  endDate: string;

  @IsString()
  reason: string;
}

export class InternalCreateCutiDTO extends CreateCutiDTO {
  @IsOptional()
  dokumenCuti?: FileMetaData;
}
