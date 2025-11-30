import { PartialType } from "@nestjs/mapped-types";
import { CreateAbsensiDTO } from "./create-absensi.dto";

export class UpdateAbsensiDTO extends PartialType(CreateAbsensiDTO){}
