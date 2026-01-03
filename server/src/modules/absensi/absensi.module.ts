import { forwardRef, Module } from '@nestjs/common';
import { AbsensiController } from './presentation/absensi.controller';
import { CheckInUseCase } from './application/use-cases/check-in.use-case';
import { CheckOutUseCase } from './application/use-cases/check-out.use-case.dto';
import { AbsensiValidationService } from './domain/services/absensi-validation.service';
import { IAbsensiRepository } from './domain/repositories/absensi.repository.interface';
import { AbsensiRepository } from './infrastructure/persistence/absensi.repository';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UsersModule } from '../users/users.module';
import { KontrakModule } from '../kontrak/kontrak.module';
import { KontrakBasedAbsensiQuotaAdapter } from '../kontrak/infrastructure/adapter/absensi-quota-adapter';
import { DateUtilService } from 'src/common/utils/dateUtil';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => KontrakModule),
    EventEmitterModule.forRoot(),
  ],
  controllers: [AbsensiController],
  providers: [
    DateUtilService,
    CheckInUseCase,
    CheckOutUseCase,
    AbsensiValidationService,
    { provide: IAbsensiRepository, useClass: AbsensiRepository },
    {
      provide: 'IAbsensiQuotaProvider',
      useExisting: KontrakBasedAbsensiQuotaAdapter,
    },
  ],
  exports: [IAbsensiRepository],
})
export class AbsensiModule { }
