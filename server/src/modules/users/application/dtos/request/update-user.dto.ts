import { IsOptional } from 'class-validator';
import { CreateUserDTO } from './create-user.dto';
import { PartialType } from '@nestjs/mapped-types';
import { FileMetaData } from 'src/common/types/FileMetaData.dto';

export class UpdateUserDTO extends PartialType(CreateUserDTO) { }

export class InternalUpdateUserDTO extends UpdateUserDTO {
  @IsOptional()
  photo?: FileMetaData;
}
