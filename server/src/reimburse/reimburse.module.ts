import { Module } from '@nestjs/common';
import { ReimburseController } from './presentation/reimburse.controller';
import { GetAllReimburseUseCase } from './application/use-cases/get-all-reimbuse.use-case';
import { GetReimburseUseCase } from './application/use-cases/get-reimbuse.use-case';
import { SubmitReimburseUseCase } from './application/use-cases/submit-reimburse.use-case';
import { ApprovalReimburseUseCase } from './application/use-cases/approval-reimburse.use-case';
import { UsersModule } from 'src/users/users.module';
import { IReimburseRepository } from './domain/repositories/reimburse.repository.interface';
import { ReimburseRepository } from './infrastructure/persistence/reimburse.repository';
import { LoggerModule } from 'src/logger/logger.module';
import { ReimburseAuthorizationService } from './domain/services/reimburse-authorization.service';

@Module({
  imports: [
    UsersModule,
    LoggerModule,
  ],
  controllers: [ReimburseController],
  providers: [
    GetAllReimburseUseCase,
    GetReimburseUseCase,
    SubmitReimburseUseCase,
    ApprovalReimburseUseCase,
    ReimburseAuthorizationService,
    { provide: IReimburseRepository, useClass: ReimburseRepository }
  ],
})
export class ReimburseModule { }
