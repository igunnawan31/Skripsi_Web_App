import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IAgendaRepository } from "../../domain/repositories/agenda.repository.interface";
import { LoggerService } from "src/modules/logger/logger.service";
import { UserRequest } from "src/common/types/UserRequest.dto";

@Injectable()
export class DeleteOccurrenceUseCase {
  constructor(
    @Inject(IAgendaRepository)
    private readonly agendaRepo: IAgendaRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(
    occurrenceId: string,
    user: UserRequest,
  ){
    this.logger.log(`${user.name} requests to delete agenda ${occurrenceId}`)
    try {
    const targetOccurrence = await this.agendaRepo.findOccurenceById(occurrenceId);
    if (!targetOccurrence) throw new NotFoundException(`Data agenda tidak ditemukan, gagal menghapus agenda`)

    await this.agendaRepo.removeOccurrence(occurrenceId);
    } catch (err) {
      this.logger.error(err);
      throw err;
    } 
  }
}
