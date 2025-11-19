import { MajorRole, MinorRole } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class UserFilterDTO {
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @IsOptional()
  @IsEnum(MajorRole)
  majorRole?: MajorRole;

  @IsOptional()
  @IsEnum(MinorRole)
  minorRole?: MinorRole;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
