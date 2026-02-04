import { PartialType } from '@nestjs/mapped-types';
import { CreateNilaiDTO } from './create-scale.dto';

export class UpdateNilaiDTO extends PartialType(CreateNilaiDTO) { }
