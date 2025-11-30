import { Expose } from "class-transformer";
import { CutiBaseDTO } from "../base.dto";
import { UserBaseDTO } from "src/users/application/dtos/base.dto";
import { meta } from "src/common/types/QueryMeta.dto";

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
