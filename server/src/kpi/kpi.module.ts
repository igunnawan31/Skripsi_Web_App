import { Module } from '@nestjs/common';
import { KpiController } from './presentation/kpi.controller';
import { IKPIRepository } from './domain/repositories/kpi.repository.interface';
import { KPIRepository } from './infrastructure/persistence/kpi.repository';

@Module({
  controllers: [KpiController],
  providers: [{ provide: IKPIRepository, useClass: KPIRepository }],
})
export class KpiModule { }
