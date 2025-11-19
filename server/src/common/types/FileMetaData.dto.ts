import { IsInt, IsString } from 'class-validator';
import {Type} from 'class-transformer';

export class FileMetaData {
  @IsString()
  filename: string;

  @IsString()
  path: string;

  @IsString()
  mimetype: string;

  @IsInt()
  @Type(() => Number)
  size: number;
}
