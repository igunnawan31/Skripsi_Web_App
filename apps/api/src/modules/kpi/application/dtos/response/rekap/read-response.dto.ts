import { Expose } from 'class-transformer';
import { meta } from 'src/common/types/QueryMeta.dto';
import { CreateIndikatorRekapResponseDTO } from './create-response.dto';

export class RetrieveIndikatorRekapResponseDTO extends CreateIndikatorRekapResponseDTO {}

export class RetrieveAllIndikatorRekapResponseDTO {
  @Expose()
  data: RetrieveIndikatorRekapResponseDTO[];

  @Expose()
  meta: meta;
}
