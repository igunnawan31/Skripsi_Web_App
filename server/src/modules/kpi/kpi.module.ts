import { Module } from '@nestjs/common';
import { IPertanyaanRepository } from './domain/repositories/pertanyaan.repository.interface';
import { PertanyaanRepository } from './infrastructure/persistence/pertanyaan.repository';
import { IndicatorController } from './presentation/indikator.controller';
import { JawabanController } from './presentation/jawaban.controller';
import { IJawabanRepository } from './domain/repositories/jawaban.repository.interface';
import { JawabanRepository } from './infrastructure/persistence/jawaban.repository';
import { IIndikatorRepository } from './domain/repositories/indikator.repository.interface';
import { IndikatorRepository } from './infrastructure/persistence/indikator.repository';
import { CreateIndikatorUseCase } from './application/use-cases/indikator/create.use-case';
import { DeleteIndikatorUseCase } from './application/use-cases/indikator/delete.use-case';
import { GetAllIndikatorUseCase } from './application/use-cases/indikator/get-all.use-case';
import { GetIndikatorUseCase } from './application/use-cases/indikator/get.use-case';
import { UpdateIndikatorUseCase } from './application/use-cases/indikator/update.use-case';
import { CreateJawabanUseCase } from './application/use-cases/jawaban/create.use-case';
import { DeleteJawabanUseCase } from './application/use-cases/jawaban/delete.use-case';
import { GetAllJawabanUseCase } from './application/use-cases/jawaban/get-all.use-case';
import { GetJawabanUseCase } from './application/use-cases/jawaban/get.use-case';
import { CreatePertanyaanUseCase } from './application/use-cases/pertanyaan/create.use-case';
import { DeletePertanyaanUseCase } from './application/use-cases/pertanyaan/delete.use-case';
import { GetAllPertanyaanUseCase } from './application/use-cases/pertanyaan/get-all.use-case';
import { GetPertanyaanUseCase } from './application/use-cases/pertanyaan/get.use-case';
import { UpdatePertanyaanUseCase } from './application/use-cases/pertanyaan/update.use-case';
import { DateUtilService } from 'src/common/utils/dateUtil';
import { PertanyaanController } from './presentation/pertanyaan.controller';
import { GetAllPertanyaanIndikatorUseCase } from './application/use-cases/pertanyaan/get-all-pertanyaan-indikator.use-case';
import { CreateEvaluationsUseCase } from './application/use-cases/indikator/create-eval.use-case';
import { UsersModule } from '../users/users.module';
import { CreateIndikatorRecapUseCase } from './application/use-cases/rekap/create.use-case';
import { UpdateStatusIndikatorUseCase } from './application/use-cases/indikator/update-status.use-case';
import { JawabanSubmittedListener } from './infrastructure/listeners/jawaban-submitted.listener';
import { GetAllIndikatorRekapUseCase } from './application/use-cases/rekap/get.use-case';
import { IndikatorRekapController } from './presentation/rekap.controller';
import { RekapRepository } from './infrastructure/persistence/rekap.repository';
import { IRekapRepository } from './domain/repositories/rekap.repository.interface';
import { UpdatePublicIndikatorUseCase } from './application/use-cases/indikator/update-public.use-case';
import { DeleteIndikatorEvaluationUseCase } from './application/use-cases/indikator/delete-eval.use-case';

@Module({
  imports: [UsersModule],
  controllers: [
    IndicatorController,
    JawabanController,
    PertanyaanController,
    IndikatorRekapController,
  ],
  providers: [
    CreateIndikatorUseCase,
    CreateEvaluationsUseCase,
    CreateIndikatorRecapUseCase,
    DeleteIndikatorUseCase,
    GetAllIndikatorUseCase,
    GetIndikatorUseCase,
    UpdateIndikatorUseCase,
    UpdateStatusIndikatorUseCase,
    UpdatePublicIndikatorUseCase,
    CreateJawabanUseCase,
    DeleteJawabanUseCase,
    DeleteIndikatorEvaluationUseCase,
    GetAllJawabanUseCase,
    GetJawabanUseCase,
    CreatePertanyaanUseCase,
    DeletePertanyaanUseCase,
    GetAllPertanyaanUseCase,
    GetAllPertanyaanIndikatorUseCase,
    GetPertanyaanUseCase,
    UpdatePertanyaanUseCase,
    DateUtilService,
    JawabanSubmittedListener,
    GetAllIndikatorRekapUseCase,
    { provide: IIndikatorRepository, useClass: IndikatorRepository },
    { provide: IJawabanRepository, useClass: JawabanRepository },
    { provide: IPertanyaanRepository, useClass: PertanyaanRepository },
    { provide: IRekapRepository, useClass: RekapRepository },
  ],
})
export class KpiModule {}
