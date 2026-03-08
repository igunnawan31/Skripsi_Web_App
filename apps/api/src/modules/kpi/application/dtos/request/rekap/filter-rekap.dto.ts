import { OmitType } from '@nestjs/mapped-types';
import { IsDate, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { FilterDTO } from 'src/common/types/Filter.dto';

export class RekapFilterDTO extends FilterDTO {
  @IsOptional()
  @IsNumber()
  minTotalNilai?: number;

  @IsOptional()
  @IsNumber()
  maxTotalNilai?: number;

  @IsOptional()
  @IsNumber()
  minRataRata?: number;

  @IsOptional()
  @IsNumber()
  maxRataRata?: number;

  @IsOptional()
  @IsDateString()
  minCreatedAt?: string;


  @IsOptional()
  @IsDateString()
  maxCreatedAt?: string;
}

export class InternalRekapFilterDTO extends OmitType(RekapFilterDTO, ['minCreatedAt', 'maxCreatedAt']) {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsDate()
  @IsOptional()
  minCreatedAt?: Date;

  @IsDate()
  @IsOptional()
  maxCreatedAt?: Date;
}
