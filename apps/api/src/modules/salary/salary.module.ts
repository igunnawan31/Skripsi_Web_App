import { Module } from '@nestjs/common';
import { SalaryController } from './presentation/salary.controller';
import { SalarySchedulingService } from './domain/services/salary-scheduling.service';
import { SalaryValidationService } from './domain/services/salary-validation.service';
import { ISalaryRepository } from './domain/repositories/salary.repository.interface';
import { SalaryRepository } from './infrastructure/persistence/salary.repository';
import { KontrakCreatedListener } from './infrastructure/listeners/kontrak-created.listener';
import { CreateSalaryUseCase } from './application/use-cases/create-salary.use-case';
import { GetAllSalariesUseCase } from './application/use-cases/get-all-salary.use-cases';
import { GetUserSalariesUseCase } from './application/use-cases/get-user-salary.use-case';
import { GetSalaryUseCase } from './application/use-cases/get-salary.use-case';
import { PaySalaryUseCase } from './application/use-cases/pay-salary.use-case';
import { DeleteSalaryUseCase } from './application/use-cases/delete-salary.use-case';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  controllers: [SalaryController],
  providers: [
    SalaryValidationService,
    SalarySchedulingService,
    KontrakCreatedListener,
    CreateSalaryUseCase,
    DeleteSalaryUseCase,
    GetAllSalariesUseCase,
    GetUserSalariesUseCase,
    GetSalaryUseCase,
    PaySalaryUseCase,
    { provide: ISalaryRepository, useClass: SalaryRepository },
  ],
  exports: [ISalaryRepository],
})
export class SalaryModule { }
