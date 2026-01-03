import { Expose } from 'class-transformer';
import { CreateReimburseResponseDTO } from './create.dto';
import { meta } from 'src/common/types/QueryMeta.dto';
import { UserBaseDTO } from 'src/users/application/dtos/base.dto';

export class RetrieveReimburseResponseDTO extends CreateReimburseResponseDTO {
  @Expose()
  requester: UserBaseDTO;

  @Expose()
  approver: UserBaseDTO;
}

export class RetrieveAllReimburseResponseDTO {
  @Expose()
  data: RetrieveReimburseResponseDTO[];

  @Expose()
  meta: meta
}
