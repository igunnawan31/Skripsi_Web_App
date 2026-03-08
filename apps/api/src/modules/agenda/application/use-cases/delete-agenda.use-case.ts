import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IAgendaRepository } from "../../domain/repositories/agenda.repository.interface";
import { LoggerService } from "src/modules/logger/logger.service";
import { UserRequest } from "src/common/types/UserRequest.dto";

@Injectable()
export class DeleteAgendaUseCase {
  constructor(
    @Inject(IAgendaRepository)
    private readonly agendaRepo: IAgendaRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(
    agendaId: string,
    user: UserRequest,
  ){
    this.logger.log(`${user.name} requests to delete agenda ${agendaId}`)
    try {
    const targetAgenda = await this.agendaRepo.findById(agendaId);
    if (!targetAgenda) throw new NotFoundException(`Data agenda tidak ditemukan, gagal menghapus agenda`)

    await this.agendaRepo.remove(agendaId);
    } catch (err) {
      this.logger.error(err);
      throw err;
    } 
  }
}
