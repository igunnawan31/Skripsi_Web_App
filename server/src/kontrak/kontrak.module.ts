import { forwardRef, Module } from '@nestjs/common';
import { KontrakController } from './presentation/kontrak.controller';
import { CreateKontrakUseCase } from './application/use-cases/create-kontrak.use-case';
import { GetUserQuotaUseCase } from './application/use-cases/get-user-quota.use-cases';
import { IKontrakRepository } from './domain/repositories/kontrak.repository.interface';
import { KontrakRepository } from './infrastructure/persistence/kontrak.repository';
import { UsersModule } from 'src/users/users.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ProjectModule } from 'src/project/project.module';
import { KontrakValidationService } from './domain/services/kontrak-validation.service';
import { CutiModule } from 'src/cuti/cuti.module';
import { AbsensiModule } from 'src/absensi/absensi.module';
import { KontrakBasedAbsensiQuotaAdapter } from './infrastructure/adapter/absensi-quota-adapter';

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
    GetUserQuotaUseCase,
    KontrakValidationService,
    KontrakBasedAbsensiQuotaAdapter,
    { provide: IKontrakRepository, useClass: KontrakRepository },
  ],
  exports: [IKontrakRepository, KontrakBasedAbsensiQuotaAdapter],
})
export class KontrakModule { }
