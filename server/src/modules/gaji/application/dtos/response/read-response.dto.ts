import { Expose } from 'class-transformer';
import { meta } from 'src/common/types/QueryMeta.dto';
import { UserBaseDTO } from 'src/modules/users/application/dtos/base.dto';
import { GajiBaseDTO } from '../base.dto';
import { KontrakBaseDTO } from 'src/modules/kontrak/application/dtos/base.dto';

export class RetrieveGajiResponseDTO extends GajiBaseDTO {
  @Expose()
  user: UserBaseDTO;

  @Expose()
  kontrak: KontrakBaseDTO;
}

export class RetrieveAllGajiResponseDTO {
  @Expose()
  data: RetrieveGajiResponseDTO[];

  @Expose()
  meta: meta;
}
