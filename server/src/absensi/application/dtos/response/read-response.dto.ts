import { Expose } from "class-transformer";
import { CreateAbsensiResponseDTO } from "./create-response.dto";
import { meta } from "src/common/types/QueryMeta.dto";
import { UserBaseDTO } from "src/users/application/dtos/base.dto";

export class RetrieveAbsensiResponseDTO extends CreateAbsensiResponseDTO {
  @Expose()
  user: UserBaseDTO;
}

export class RetrieveAllAbsensiResponseDTO {
  @Expose()
  data: RetrieveAbsensiResponseDTO[];

  @Expose()
  meta: meta;
}
