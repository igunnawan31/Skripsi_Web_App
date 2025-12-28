import { PartialType } from '@nestjs/mapped-types';
import {
  CreateKontrakDTO,
  InternalCreateKontrakDTO,
} from './create-kontrak.dto';
import { IsOptional } from 'class-validator';

export class UpdateKontrakDTO extends PartialType(CreateKontrakDTO) {
  @IsOptional()
  removeDocuments?: string[];
}
export class InternalUpdateKontrakDTO extends PartialType(InternalCreateKontrakDTO) {
  @IsOptional()
  removeDocuments?: string[];
}
