import { PartialType } from "@nestjs/mapped-types";
import { CreateIndikatorDTO, InternalCreateIndikatorDTO } from "./create-indicator.dto";

export class UpdateIndikatorDTO extends PartialType(CreateIndikatorDTO) {}

export class InternalUpdateIndikatorDTO extends PartialType(InternalCreateIndikatorDTO) {}
