import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CheckOutDTO {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsOptional()
  @IsString()
  notes: string;

  @IsNotEmpty()
  @IsDateString()
  checkOut: string;
}
