import { Expose } from "class-transformer";
import { CutiBaseDTO } from "../base.dto";
import { meta } from "src/common/types/QueryMeta.dto";
import { UserBaseDTO } from "src/modules/users/application/dtos/base.dto";

export class RetrieveCutiResponseDTO extends CutiBaseDTO {
  @Expose()
  user: UserBaseDTO;

  @Expose()
  approver: UserBaseDTO;
}

export class RetrieveAllCutiResponseDTO {
  @Expose()
  data: RetrieveCutiResponseDTO[];

  @Expose()
  meta: meta;
}
