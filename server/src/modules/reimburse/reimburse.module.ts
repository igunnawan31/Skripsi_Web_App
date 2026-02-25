import { Module } from '@nestjs/common';
import { ReimburseController } from './presentation/reimburse.controller';
import { SubmitReimburseUseCase } from './application/use-cases/submit-reimburse.use-case';
import { ApprovalReimburseUseCase } from './application/use-cases/approval-reimburse.use-case';
import { IReimburseRepository } from './domain/repositories/reimburse.repository.interface';
import { ReimburseRepository } from './infrastructure/persistence/reimburse.repository';
import { ReimburseAuthorizationService } from './domain/services/reimburse-authorization.service';
import { UsersModule } from '../users/users.module';
import { LoggerModule } from '../logger/logger.module';
import { GetReimburseUseCase } from './application/use-cases/get-reimburse.use-case';
import { GetAllReimburseUseCase } from './application/use-cases/get-all-reimburse.use-case';
import { DeleteReimburseUseCase } from './application/use-cases/delete-reimburse.use-case';
import { GetUserAllReimburseUseCase } from './application/use-cases/get-user-all.use-case';

@Module({
  imports: [
    UsersModule,
    LoggerModule,
  ],
  controllers: [ReimburseController],
  providers: [
    GetAllReimburseUseCase,
    GetUserAllReimburseUseCase,
    GetReimburseUseCase,
    SubmitReimburseUseCase,
    ApprovalReimburseUseCase,
    ReimburseAuthorizationService,
    DeleteReimburseUseCase,
    { provide: IReimburseRepository, useClass: ReimburseRepository }
  ],
})
export class ReimburseModule { }
