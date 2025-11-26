import { Expose } from 'class-transformer';
import { KontrakBaseDTO } from '../base.dto';
import { UserBaseDTO } from 'src/users/application/dtos/base.dto';
import { ProjectBaseDTO } from 'src/project/application/dtos/base.dto';
import { GajiBaseDTO } from 'src/gaji/application/dtos/base.dto';
import { meta } from 'src/common/types/QueryMeta.dto';

export class RetrieveKontrakResponseDTO extends KontrakBaseDTO {
  @Expose()
  user: UserBaseDTO;

  @Expose()
  project: ProjectBaseDTO;

  @Expose()
  gaji: GajiBaseDTO[];
}

export class RetrieveAllKontrakResponseDTO {
  @Expose()
  data: RetrieveKontrakResponseDTO[];

  @Expose()
  meta: meta;
}
