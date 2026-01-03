import { meta } from 'src/common/types/QueryMeta.dto';
import { CreateUserResponseDTO } from './create-response.dto';
import { Expose } from 'class-transformer';
import { AbsensiBaseDTO } from 'src/modules/absensi/application/dtos/base.dto';
import { CutiBaseDTO } from 'src/modules/cuti/application/dtos/base.dto';
import { GajiBaseDTO } from 'src/modules/gaji/application/dtos/base.dto';
import { KontrakBaseDTO } from 'src/modules/kontrak/application/dtos/base.dto';
import { ProjectTeamBaseDTO } from 'src/modules/project/application/dtos/base.dto';
import { IndikatorKPIBaseDTO, IndikatorKPIPivotBaseDTO } from 'src/modules/kpi/application/dtos/indikatorKPI.dto';
import { JawabanKPIBaseDTO } from 'src/modules/kpi/application/dtos/jawabanKPI.dto';
import { RekapKPIBaseDTO } from 'src/modules/kpi/application/dtos/rekapKPI.dto';

export class RetrieveUserResponseDTO extends CreateUserResponseDTO {
  @Expose()
  absensi: AbsensiBaseDTO[];
  @Expose()
  cutiDiajukan: CutiBaseDTO[];
  @Expose()
  cutiDisetujui: CutiBaseDTO[];
  @Expose()
  gaji: GajiBaseDTO[];
  @Expose()
  kontrak: KontrakBaseDTO[];
  @Expose()
  projectTeams: ProjectTeamBaseDTO[];
  @Expose()
  indikatorDibuat: IndikatorKPIBaseDTO[];
  @Expose()
  penilaiKPI: JawabanKPIBaseDTO[];
  @Expose()
  dinilaiKPI: JawabanKPIBaseDTO[];
  @Expose()
  rekapKPI: RekapKPIBaseDTO[];
  @Expose()
  indikatorPenilai: IndikatorKPIPivotBaseDTO[];
  @Expose()
  indikatorDinilai: IndikatorKPIPivotBaseDTO[];
}

export class RetrieveAllUserResponseDTO {
  @Expose()
  data: RetrieveUserResponseDTO[];
  @Expose()
  meta: meta;
}
