import { Expose } from 'class-transformer';
import { meta } from 'src/common/types/QueryMeta.dto';
import { UserBaseDTO } from 'src/modules/users/application/dtos/base.dto';
import { KontrakBaseDTO } from 'src/modules/kontrak/application/dtos/base.dto';
import { SalaryBaseDTO } from '../base.dto';

export class RetrieveSalaryResponseDTO extends SalaryBaseDTO {
  @Expose()
  user: UserBaseDTO;

  @Expose()
  kontrak: KontrakBaseDTO;
}

export class RetrieveAllSalaryResponseDTO {
  @Expose()
  data: RetrieveSalaryResponseDTO[];

  @Expose()
  meta: meta;
}
