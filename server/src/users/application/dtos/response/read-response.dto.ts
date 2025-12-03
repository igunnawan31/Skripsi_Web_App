import { meta } from "src/common/types/QueryMeta.dto";
import { CreateUserResponseDTO } from "./create-response.dto";
import { AbsensiBaseDTO } from "src/absensi/application/dtos/base.dto";
import { CutiBaseDTO } from "src/cuti/application/dtos/base.dto";
import { GajiBaseDTO } from "src/gaji/application/dtos/base.dto";
import { KontrakBaseDTO } from "src/kontrak/application/dtos/base.dto";
import { ProjectTeamBaseDTO } from "src/project/application/dtos/base.dto";
import { IndikatorKPIBaseDTO, IndikatorKPIPivotBaseDTO } from "src/kpi/application/dtos/indikatorKPI.dto";
import { JawabanKPIBaseDTO } from "src/kpi/application/dtos/jawabanKPI.dto";
import { RekapKPIBaseDTO } from "src/kpi/application/dtos/rekapKPI.dto";

export class RetrieveUserResponseDTO extends CreateUserResponseDTO {
  absensi: AbsensiBaseDTO[];
  cutiDiajukan: CutiBaseDTO[];
  cutiDisetujui: CutiBaseDTO[];
  gaji: GajiBaseDTO[];
  kontrak: KontrakBaseDTO[];
  projectTeams: ProjectTeamBaseDTO[];
  indikatorDibuat: IndikatorKPIBaseDTO[];
  penilaiKPI: JawabanKPIBaseDTO[];
  dinilaiKPI: JawabanKPIBaseDTO[];
  rekapKPI: RekapKPIBaseDTO[];
  indikatorPenilai: IndikatorKPIPivotBaseDTO[];
  indikatorDinilai: IndikatorKPIPivotBaseDTO[];
}

export class RetrieveAllUserResponseDTO {
  data: RetrieveUserResponseDTO[];
  meta: meta;
}
