import { PartialType } from '@nestjs/mapped-types';
import { CreateCutiDTO } from './create-cuti.dto';
import { StatusCuti } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateCutiDTO extends PartialType(CreateCutiDTO) {
  @IsEnum(StatusCuti)
  status: StatusCuti;
}
