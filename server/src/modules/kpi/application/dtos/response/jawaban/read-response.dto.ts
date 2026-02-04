import { Expose } from "class-transformer";
import { JawabanKPIBaseDTO } from "../../jawabanKPI.dto";
import { IndikatorKPIBaseDTO } from "../../indikatorKPI.dto";
import { PertanyaanKPIBaseDTO } from "../../pertanyaanKPI.dto";
import { UserBaseDTO } from "src/modules/users/application/dtos/base.dto";
import { meta } from "src/common/types/QueryMeta.dto";

export class RetrieveJawabanResponseDTO extends JawabanKPIBaseDTO {
  @Expose()
  indikator: IndikatorKPIBaseDTO;

  @Expose()
  pertanyaan: PertanyaanKPIBaseDTO;

  @Expose()
  penilai: UserBaseDTO;

  @Expose()
  dinilai: UserBaseDTO;
}

export class RetrieveAllJawabanResponseDTO {
  @Expose()
  data: RetrieveJawabanResponseDTO[];

  @Expose()
  meta: meta;
}
