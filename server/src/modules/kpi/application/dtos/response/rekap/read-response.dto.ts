import { Expose } from "class-transformer";
import { RekapKPIBaseDTO } from "../../rekapKPI.dto";
import { IndikatorKPIBaseDTO } from "../../indikatorKPI.dto";
import { UserBaseDTO } from "src/modules/users/application/dtos/base.dto";

export class RetrieveRekapDTO extends RekapKPIBaseDTO {
  @Expose()
  indikator: IndikatorKPIBaseDTO;

  @Expose()
  user: UserBaseDTO;
}
