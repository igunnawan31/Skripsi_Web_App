import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CheckOutDTO {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  notes: string;
}
