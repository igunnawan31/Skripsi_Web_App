import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IAgendaRepository } from '../../domain/repositories/agenda.repository.interface';
import { LoggerService } from 'src/modules/logger/logger.service';
import {
  UpdateAgendaOccurrenceResponseDTO,
  UpdateAgendaResponseDTO,
} from '../dtos/response/update.dto';
import {
  InternalUpdateAgendaDTO,
  InternalUpdateAgendaOccurrenceDTO,
} from '../dtos/request/update.dto';

@Injectable()
export class UpdateAgendaOccurrenceUseCase {
  constructor(
    @Inject(IAgendaRepository)
    private readonly agendaRepo: IAgendaRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(
    occurrenceId: string,
    dto: InternalUpdateAgendaOccurrenceDTO,
  ): Promise<UpdateAgendaOccurrenceResponseDTO> {
    try {
      const targetOccurrence =
        await this.agendaRepo.findOccurenceById(occurrenceId);
      if (!targetOccurrence)
        throw new NotFoundException(
          `Data agenda tidak ditemukan, gagal memperbarui data`,
        );

      const isCancelledChanged =
        dto.isCancelled !== undefined &&
        dto.isCancelled !== targetOccurrence.isCancelled;

      const dateChanged =
        dto.date !== undefined &&
        new Date(targetOccurrence.date).toISOString() !== dto.date.toISOString();

      if (!isCancelledChanged && !dateChanged) {
        throw new BadRequestException(
          'Agenda sudah dibatalkan. Tidak dapat memperbarui data',
        );
      }

      const updatedAgenda = await this.agendaRepo.updateOccurrence(
        occurrenceId,
        dto,
      );
      return updatedAgenda;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
