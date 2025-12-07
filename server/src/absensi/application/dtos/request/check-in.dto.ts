import { WorkStatus } from "@prisma/client";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

export class CheckInDTO {
  @IsString()
  userId: string;

  @IsEnum(WorkStatus)
  workStatus: WorkStatus;

  @IsDateString()
  checkIn: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  latitude: string;

  @IsString()
  @IsOptional()
  longitude: string;
}
