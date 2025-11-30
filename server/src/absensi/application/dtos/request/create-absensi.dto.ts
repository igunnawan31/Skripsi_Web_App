import { WorkStatus } from "@prisma/client";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

export class CreateAbsensiDTO {
  @IsString()
  userId: string;

  @IsDateString()
  date: string;

  @IsEnum(WorkStatus)
  workStatus: WorkStatus;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
