import { Expose } from "class-transformer";
import { IndikatorKPIBaseDTO } from "../../indikatorKPI.dto";
import { JawabanKPIBaseDTO } from "../../jawabanKPI.dto";
import { PertanyaanKPIBaseDTO } from "../../pertanyaanKPI.dto";
import { meta } from "src/common/types/QueryMeta.dto";

export class RetrievePertanyaanResponseDTO extends PertanyaanKPIBaseDTO {
  @Expose()
  indikator: IndikatorKPIBaseDTO;

  @Expose()
  jawaban: JawabanKPIBaseDTO[];
}

export class RetrieveAllPertanyaanResponseDTO {
  @Expose()
  data: RetrievePertanyaanResponseDTO[];

  @Expose()
  meta: meta;
}
