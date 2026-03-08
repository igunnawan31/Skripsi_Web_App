import { Expose } from "class-transformer";
import { meta } from "src/common/types/QueryMeta.dto";
import { CheckInResponseDTO } from "./create-response.dto";
import { UserBaseDTO } from "src/modules/users/application/dtos/base.dto";

export class RetrieveAbsensiResponseDTO extends CheckInResponseDTO {
  @Expose()
  user: UserBaseDTO;
}

export class RetrieveAllAbsensiResponseDTO {
  @Expose()
  data: RetrieveAbsensiResponseDTO[];

  @Expose()
  meta: meta;
}
