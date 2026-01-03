import { forwardRef, Module } from '@nestjs/common';
import { KontrakController } from './presentation/kontrak.controller';
import { CreateKontrakUseCase } from './application/use-cases/create-kontrak.use-case';
import { GetUserQuotaUseCase } from './application/use-cases/get-user-quota.use-cases';
import { IKontrakRepository } from './domain/repositories/kontrak.repository.interface';
import { KontrakRepository } from './infrastructure/persistence/kontrak.repository';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { KontrakValidationService } from './domain/services/kontrak-validation.service';
import { KontrakBasedAbsensiQuotaAdapter } from './infrastructure/adapter/absensi-quota-adapter';
import { UpdateKontrakUseCase } from './application/use-cases/update-kontrak.use-case';
import { GetKontrakUseCase } from './application/use-cases/get-kontrak.use-case';
import { GetUserKontrakUseCase } from './application/use-cases/get-user-kontrak.use-case';
import { GetAllKontrakUseCase } from './application/use-cases/getAll-kontrak.use-case';
import { DeleteKontrakUseCase } from './application/use-cases/delete-kontrak.use-case';
import { UsersModule } from '../users/users.module';
import { CutiModule } from '../cuti/cuti.module';
import { AbsensiModule } from '../absensi/absensi.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => CutiModule),
    forwardRef(() => AbsensiModule),
    ProjectModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [KontrakController],
  providers: [
    CreateKontrakUseCase,
    UpdateKontrakUseCase,
    GetKontrakUseCase,
    GetUserKontrakUseCase,
    GetAllKontrakUseCase,
    DeleteKontrakUseCase,
    GetUserQuotaUseCase,
    KontrakValidationService,
    KontrakBasedAbsensiQuotaAdapter,
    { provide: IKontrakRepository, useClass: KontrakRepository },
  ],
  exports: [IKontrakRepository, KontrakBasedAbsensiQuotaAdapter],
})
export class KontrakModule { }
