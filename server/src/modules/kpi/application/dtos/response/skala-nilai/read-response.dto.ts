import { Expose } from "class-transformer";
import { PertanyaanKPIBaseDTO } from "../../pertanyaanKPI.dto";
import { SkalaNilaiBaseDTO } from "../../skalaNilai.dto";
import { meta } from "src/common/types/QueryMeta.dto";

export class RetrieveNilaiResponseDTO extends SkalaNilaiBaseDTO {
  @Expose()
  pertanyaan: PertanyaanKPIBaseDTO[];
}

export class RetrieveAllNilaiResponseDTO {
  @Expose()
  data: RetrieveNilaiResponseDTO;

  @Expose()
  meta: meta;
}
