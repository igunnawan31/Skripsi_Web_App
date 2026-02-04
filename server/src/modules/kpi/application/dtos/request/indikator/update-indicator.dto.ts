import { PartialType } from "@nestjs/mapped-types";
import { CreateIndikatorDTO } from "./create-indicator.dto";

export class UpdateIndikatorDTO extends PartialType(CreateIndikatorDTO) {}
