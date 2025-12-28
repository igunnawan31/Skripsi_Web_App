import { MajorRole, MinorRole } from '@prisma/client';
import {
    IsDefined,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
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

export class UserProvisionInputDTO {
  @IsOptional()
  @IsString()
  id?: string; // in case bikin user dulu baru bikin kontrak
  
  @ValidateIf(o => !o.id)
  @IsDefined()
  @IsString()
  name: string;

  @ValidateIf(o => !o.id)
  @IsDefined()
  @IsEmail()
  email: string;

  @ValidateIf(o => !o.id)
  @IsDefined()
  @IsString()
  @MinLength(6)
  password: string;

  @ValidateIf(o => !o.id)
  @IsDefined()
  @IsEnum(MinorRole)
  minorRole: MinorRole;

  @IsOptional()
  photo?: FileMetaData;
}


export class InternalCreateUserDTO extends CreateUserDTO {
  @IsOptional()
  photo?: FileMetaData;
}
