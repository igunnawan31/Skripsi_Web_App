import { IsInt, IsString } from 'class-validator';
import {Type} from 'class-transformer';

export class FileMetaData {
  @IsString()
  fieldname: string;

  @IsString()
  originalname: string;

  @IsString()
  encoding: string;

  @IsString()
  mimetype: string;

  @IsString()
  destination: string;
  
  @IsString()
  filename: string;

  @IsString()
  path: string;

  @IsInt()
  @Type(() => Number)
  size: number;
}
