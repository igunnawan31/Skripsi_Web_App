import { StatusCuti } from "@prisma/client";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

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
