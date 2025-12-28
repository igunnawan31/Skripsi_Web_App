import { InternalCreateProjectDTO } from 'src/project/application/dtos/request/create-project.dto';
import { ProjectFilterDTO } from 'src/project/application/dtos/request/project-filter.dto';
import { InternalUpdateProjectDTO } from 'src/project/application/dtos/request/update-project.dto';
import { CreateProjectResponseDTO } from 'src/project/application/dtos/response/create-response.dto';
import {
  RetrieveAllProjectResponseDTO,
  RetrieveProjectResponseDTO,
  RetrieveTeamResponseDTO,
} from 'src/project/application/dtos/response/read-response.dto';
import { UpdateProjectResponseDTO } from 'src/project/application/dtos/response/update-response.dto';

export abstract class IProjectRepository {
  abstract findAll(
    filters: ProjectFilterDTO,
  ): Promise<RetrieveAllProjectResponseDTO | null>;
  abstract findById(id: string): Promise<RetrieveProjectResponseDTO | null>;
  abstract findTeamById(id: string): Promise<RetrieveTeamResponseDTO[] | null>;
  abstract create(
    data: InternalCreateProjectDTO,
  ): Promise<CreateProjectResponseDTO>;
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
