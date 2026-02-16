import { UserBaseDTO } from "src/modules/users/application/dtos/base.dto";
import { IndikatorKPIBaseDTO, EvaluationKPIDTO} from "../../indikatorKPI.dto";
import { PertanyaanKPIBaseDTO } from "../../pertanyaanKPI.dto";
import { JawabanKPIBaseDTO } from "../../jawabanKPI.dto";
import { RekapKPIBaseDTO } from "../../rekapKPI.dto";
import { Expose } from "class-transformer";
import { meta } from "src/common/types/QueryMeta.dto";

export class RetrieveIndikatorResponseDTO extends IndikatorKPIBaseDTO {
  @Expose()
  createdBy: UserBaseDTO;

  @Expose()
  pertanyaan: PertanyaanKPIBaseDTO[];

  @Expose()
  evaluations: EvaluationKPIDTO[];

  @Expose()
  jawaban: JawabanKPIBaseDTO[];

  @Expose()
  rekap: RekapKPIBaseDTO[];
}

export class RetrieveAllIndikatorResponseDTO {
  @Expose()
  data: RetrieveIndikatorResponseDTO[];

  @Expose()
  meta: meta;
}
