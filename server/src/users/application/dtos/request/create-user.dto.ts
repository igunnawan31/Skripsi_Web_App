import { MajorRole, MinorRole } from "@prisma/client";
import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(MajorRole)
  majorRole: MajorRole;

  @IsEnum(MinorRole)
  minorRole: MinorRole;

}
