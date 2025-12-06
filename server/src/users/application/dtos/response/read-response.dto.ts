import { meta } from 'src/common/types/QueryMeta.dto';
import { CreateUserResponseDTO } from './create-response.dto';
import { AbsensiBaseDTO } from 'src/absensi/application/dtos/base.dto';
import { CutiBaseDTO } from 'src/cuti/application/dtos/base.dto';
import { GajiBaseDTO } from 'src/gaji/application/dtos/base.dto';
import { KontrakBaseDTO } from 'src/kontrak/application/dtos/base.dto';
import { ProjectTeamBaseDTO } from 'src/project/application/dtos/base.dto';
import {
  IndikatorKPIBaseDTO,
  IndikatorKPIPivotBaseDTO,
} from 'src/kpi/application/dtos/indikatorKPI.dto';
import { JawabanKPIBaseDTO } from 'src/kpi/application/dtos/jawabanKPI.dto';
import { RekapKPIBaseDTO } from 'src/kpi/application/dtos/rekapKPI.dto';
import { Expose } from 'class-transformer';

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
