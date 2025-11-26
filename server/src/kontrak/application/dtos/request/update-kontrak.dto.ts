import { PartialType } from "@nestjs/mapped-types";
import { CreateKontrakDTO } from "./create-kontrak.dto";

export class UpdateKontrakDTO extends PartialType(CreateKontrakDTO) {}
