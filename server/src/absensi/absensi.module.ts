import { forwardRef, Module } from '@nestjs/common';
import { AbsensiController } from './presentation/absensi.controller';
import { CheckInUseCase } from './application/use-cases/check-in.use-case';
import { CheckOutUseCase } from './application/use-cases/check-out.use-case.dto';
import { AbsensiValidationService } from './domain/services/absensi-validation.service';
import { IAbsensiRepository } from './domain/repositories/absensi.repository.interface';
import { AbsensiRepository } from './infrastructure/persistence/absensi.repository';
import { UsersModule } from 'src/users/users.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { KontrakBasedAbsensiQuotaAdapter } from 'src/kontrak/infrastructure/adapter/absensi-quota-adapter';
import { KontrakModule } from 'src/kontrak/kontrak.module';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => KontrakModule),
    EventEmitterModule.forRoot(),
  ],
  controllers: [AbsensiController],
  providers: [
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
