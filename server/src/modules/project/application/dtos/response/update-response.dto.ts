import { PartialType } from "@nestjs/mapped-types";
import { CreateProjectResponseDTO } from "./create-response.dto";

export class UpdateProjectResponseDTO extends PartialType(CreateProjectResponseDTO) {}
