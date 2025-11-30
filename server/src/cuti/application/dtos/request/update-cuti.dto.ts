import { PartialType } from '@nestjs/mapped-types';
import { CreateCutiDTO } from './create-cuti.dto';

export class UpdateCutiDTO extends PartialType(CreateCutiDTO) { }
