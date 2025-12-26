import { MajorRole, MinorRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { FileMetaData } from 'src/common/types/FileMetaData.dto';

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

export class InternalCreateUserDTO extends CreateUserDTO {
  @IsOptional()
  photo?: FileMetaData;
}
