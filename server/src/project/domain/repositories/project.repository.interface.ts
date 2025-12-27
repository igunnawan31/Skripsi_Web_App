import { InternalCreateProjectDTO } from 'src/project/application/dtos/request/create-project.dto';
import { ProjectFilterDTO } from 'src/project/application/dtos/request/project-filter.dto';
import { InternalUpdateProjectDTO } from 'src/project/application/dtos/request/update-project.dto';
import { CreateProjectResponseDTO } from 'src/project/application/dtos/response/create-response.dto';
import { DeleteProjectResponseDTO } from 'src/project/application/dtos/response/delete-response.dto';
import {
  RetrieveAllProjectResponseDTO,
  RetrieveProjectResponseDTO,
  RetrieveTeamResponseDTO,
} from 'src/project/application/dtos/response/read-response.dto';
import { UpdateProjectResponseDTO } from 'src/project/application/dtos/response/update-response.dto';

export abstract class IProjectRepository {
  abstract findAll(
    filters: ProjectFilterDTO,
  ): Promise<RetrieveAllProjectResponseDTO>;
  abstract findById(id: string): Promise<RetrieveProjectResponseDTO>;
  abstract findTeamById(id: string): Promise<RetrieveTeamResponseDTO[]>;
  abstract create(
    data: InternalCreateProjectDTO,
  ): Promise<CreateProjectResponseDTO>;
  abstract update(
    id: string,
    data: InternalUpdateProjectDTO,
  ): Promise<UpdateProjectResponseDTO>;
  abstract remove(id: string): Promise<DeleteProjectResponseDTO>;
  abstract removePersonel(
    projectId: string,
    userId: string,
  ): Promise<RetrieveTeamResponseDTO[]>;
}
