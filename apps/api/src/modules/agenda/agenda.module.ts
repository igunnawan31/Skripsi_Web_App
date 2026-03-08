import { Module } from '@nestjs/common';
import { ProjectModule } from '../project/project.module';
import { AgendasController } from './presentation/agenda.controller';
import { CreateAgendaUseCase } from './application/use-cases/create.use-case';
import { DeleteAgendaUseCase } from './application/use-cases/delete-agenda.use-case';
import { DeleteOccurrenceUseCase } from './application/use-cases/delete-occurrence.use-case';
import { GetAgendaUseCase } from './application/use-cases/get-agenda.use-case';
import { GetAllAgendaUseCase } from './application/use-cases/get-all-agenda.use-case';
import { GetAllOccurrencesUseCase } from './application/use-cases/get-all-occurrences.use-case';
import { UpdateAgendaUseCase } from './application/use-cases/update-agenda.use-case';
import { UpdateAgendaOccurrenceUseCase } from './application/use-cases/update-occurrences.use-case';
import { IAgendaRepository } from './domain/repositories/agenda.repository.interface';
import { AgendaRepository } from './infrastructure/persistence/agenda.repository';
import { DateUtilService } from 'src/common/utils/dateUtil';

@Module({
  imports: [ProjectModule],
  controllers: [AgendasController],
  providers: [
    DateUtilService,
    CreateAgendaUseCase,
    DeleteAgendaUseCase,
    DeleteOccurrenceUseCase,
    GetAgendaUseCase,
    GetAllAgendaUseCase,
    GetAllOccurrencesUseCase,
    UpdateAgendaUseCase,
    UpdateAgendaOccurrenceUseCase,
    { provide: IAgendaRepository, useClass: AgendaRepository },
  ],
  exports: [],
})
export class AgendaModule {}
