import { Expose } from 'class-transformer';
import { CreateProjectResponseDTO } from './create-response.dto';
import { meta } from 'src/common/types/QueryMeta.dto';
import { ProjectTeamBaseDTO } from '../base.dto';
import { KontrakBaseDTO } from 'src/modules/kontrak/application/dtos/base.dto';

export class RetrieveProjectResponseDTO extends CreateProjectResponseDTO {
  @Expose()
  projectTeams: ProjectTeamBaseDTO[];

  @Expose()
  kontrak: KontrakBaseDTO[];
}

export class RetrieveAllProjectResponseDTO {
  @Expose()
  data: RetrieveProjectResponseDTO[];

  @Expose()
  meta: meta;
}

export class RetrieveTeamResponseDTO {
  @Expose()
  projectId: string;

  @Expose()
  userId: string;
}
