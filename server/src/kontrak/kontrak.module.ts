import { Module } from '@nestjs/common';
import { KontrakController } from './presentation/kontrak.controller';
import { CreateKontrakUseCase } from './application/use-cases/create-kontrak.use-case';
import { GetUserQuotaUseCase } from './application/use-cases/get-user-quota.use-cases';
import { IKontrakRepository } from './domain/repositories/kontrak.repository.interface';
import { KontrakRepository } from './infrastructure/persistence/kontrak.repository';

@Module({
  imports: [KontrakModule],
  controllers: [KontrakController],
  providers: [
    CreateKontrakUseCase,
    GetUserQuotaUseCase,
    { provide: IKontrakRepository, useClass: KontrakRepository },
  ],
  exports: [IKontrakRepository],
})
export class KontrakModule { }
