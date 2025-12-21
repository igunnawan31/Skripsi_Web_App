import { WorkStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { FileMetaData } from "src/common/types/FileMetaData.dto";

export class CheckInDTO {
  @IsString()
  userId: string;

  @IsEnum(WorkStatus)
  workStatus: WorkStatus;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  latitude?: string;

  @IsString()
  @IsOptional()
  longitude?: string;
}

export class InternalCheckInDTO extends CheckInDTO {
  @IsNotEmpty()
  photo: FileMetaData;
}
