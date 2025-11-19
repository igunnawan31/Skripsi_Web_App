import { meta } from "src/common/types/QueryMeta.dto";
import { CreateUserResponseDTO } from "./create-response.dto";
import { AbsensiBaseDTO } from "src/absensi/dto/base.dto";
import { CutiBaseDTO } from "src/cuti/dto/base.dto";
import { GajiBaseDTO } from "src/gaji/dto/base.dto";
import { KontrakBaseDTO } from "src/kontrak/dto/base.dto";
import { ProjectTeamBaseDTO } from "src/project/dto/base.dto";
import { IndikatorKPIBaseDTO, IndikatorKPIPivotBaseDTO } from "src/kpi/entities/indikatorKPI.dto";
import { JawabanKPIBaseDTO } from "src/kpi/entities/jawabanKPI.dto";
import { RekapKPIBaseDTO } from "src/kpi/entities/rekapKPI.dto";

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
