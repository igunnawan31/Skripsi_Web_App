import { Expose } from 'class-transformer';
import { KontrakBaseDTO } from '../base.dto';
import { meta } from 'src/common/types/QueryMeta.dto';
import { UserBaseDTO } from 'src/modules/users/application/dtos/base.dto';
import { ProjectBaseDTO } from 'src/modules/project/application/dtos/base.dto';
import { SalaryBaseDTO } from 'src/modules/salary/application/dtos/base.dto';

export class RetrieveKontrakResponseDTO extends KontrakBaseDTO {
  @Expose()
  user: UserBaseDTO;

  @Expose()
  project: ProjectBaseDTO;

  @Expose()
  salary: SalaryBaseDTO[];
}

export class RetrieveAllKontrakResponseDTO {
  @Expose()
  data: RetrieveKontrakResponseDTO[];

  @Expose()
  meta: meta;
}
