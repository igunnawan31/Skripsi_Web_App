import { UserRequest } from "src/common/types/UserRequest.dto";
import { InternalCreateProjectDTO } from "../../application/dtos/request/create-project.dto";
import { ProjectFilterDTO } from "../../application/dtos/request/project-filter.dto";
import { InternalUpdateProjectDTO } from "../../application/dtos/request/update-project.dto";
import { CreateProjectResponseDTO, CreateProjectTeamResponseDTO } from "../../application/dtos/response/create-response.dto";
import { RetrieveAllProjectResponseDTO, RetrieveProjectResponseDTO, RetrieveTeamResponseDTO } from "../../application/dtos/response/read-response.dto";
import { UpdateProjectResponseDTO } from "../../application/dtos/response/update-response.dto";

export abstract class IProjectRepository {
  abstract findAll(
    filters: ProjectFilterDTO,
    user: UserRequest,
  ): Promise<RetrieveAllProjectResponseDTO | null>;
  abstract findById(id: string): Promise<RetrieveProjectResponseDTO | null>;
  abstract findTeamById(id: string): Promise<RetrieveTeamResponseDTO[] | null>;
  abstract create(
    data: InternalCreateProjectDTO,
  ): Promise<CreateProjectResponseDTO>;
  abstract addPersonel(projectId: string, userId: string): Promise<CreateProjectTeamResponseDTO>;
  abstract update(
    id: string,
    data: InternalUpdateProjectDTO,
  ): Promise<UpdateProjectResponseDTO>;
  abstract remove(id: string): Promise<void>;
  abstract removePersonel(
    projectId: string,
    userId: string,
  ): Promise<void>;
}
