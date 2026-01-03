import { PartialType } from "@nestjs/mapped-types";
import { CreateGajiDTO } from "./create-gaji.dto";

export class UpdateGajiDTO extends PartialType(CreateGajiDTO) {}