import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IAgendaRepository } from '../../domain/repositories/agenda.repository.interface';
import { LoggerService } from 'src/modules/logger/logger.service';
import { RetrieveAgendaResponseDTO } from '../dtos/response/read.dto';
import { UserRequest } from 'src/common/types/UserRequest.dto';

@Injectable()
export class GetAgendaUseCase {
  constructor(
    @Inject(IAgendaRepository)
    private readonly agendaRepo: IAgendaRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(
    id: string,
    user: UserRequest,
  ): Promise<RetrieveAgendaResponseDTO> {
    this.logger.log(`${user.email} requests get agenda ${id}`);
    const agenda = await this.agendaRepo.findById(id);
    if (!agenda) throw new NotFoundException('Data agenda tidak ditemukan');
    return agenda;
  }
}
