import { PartialType } from "@nestjs/mapped-types";
import { ProjectBaseDTO } from "../base.dto";

export class DeleteProjectResponseDTO extends PartialType(ProjectBaseDTO) {}
