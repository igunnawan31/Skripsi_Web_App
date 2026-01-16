import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IAgendaRepository } from '../../domain/repositories/agenda.repository.interface';
import { LoggerService } from 'src/modules/logger/logger.service';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { RetrieveAgendaOccurrencesResponseDTO } from '../dtos/response/read.dto';

@Injectable()
export class GetAllOccurrencesUseCase {
  constructor(
    @Inject(IAgendaRepository)
    private readonly agendaRepo: IAgendaRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(
    date: Date,
  ): Promise<RetrieveAgendaOccurrencesResponseDTO[]> {
    const year = date.getFullYear()
    const month =  date.getMonth()
    console.log(year, month);
    const agendaOccurrences = await this.agendaRepo.findAllOccurrences(
      year,
      month,
    );
    if (!agendaOccurrences)
      throw new NotFoundException('Data agenda occurrences tidak ditemukan');

    return agendaOccurrences;
  }
}
