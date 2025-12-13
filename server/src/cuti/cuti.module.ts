import { forwardRef, Module } from '@nestjs/common';
import { CutiController } from './presentation/cuti.controller';
import { SubmitCutiUseCase } from './application/use-cases/submit-cuti.use-case';
import { ApproveCutiUseCase } from './application/use-cases/approve-cuti.use-case';
import { RejectCutiUseCase } from './application/use-cases/reject-cuti.use-case';
import { CancelCutiUseCase } from './application/use-cases/cancel-cuti.use-case';
import { CutiAuthorizationService } from './domain/services/cuti-approval-authorization.service';
import { CutiQuotaService } from './domain/services/cuti-quota.service';
import { ICutiRepository } from './domain/repositories/cuti.repository.interface';
import { CutiRepository } from './infrastructure/persistence/cuti.repository';
import { UsersModule } from 'src/users/users.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { KontrakModule } from 'src/kontrak/kontrak.module';
import { CutiExpirationScheduler } from './infrastructure/scheduler/cuti-expiration.scheduler';
import { CutiExpirationService } from './domain/services/cuti-expiration.service';
import { DateUtilService } from 'src/common/utils/dateUtil';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => KontrakModule),
    EventEmitterModule.forRoot(),
  ],
  controllers: [CutiController],
  providers: [
    CutiExpirationScheduler,
    CutiExpirationService,
    DateUtilService,
    LoggerService,
    SubmitCutiUseCase,
    ApproveCutiUseCase,
    RejectCutiUseCase,
    CancelCutiUseCase,
    CutiAuthorizationService,
    CutiQuotaService,
    { provide: ICutiRepository, useClass: CutiRepository },
  ],
  exports: [ICutiRepository],
})
export class CutiModule { }
