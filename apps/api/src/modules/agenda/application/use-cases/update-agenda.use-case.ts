import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IAgendaRepository } from '../../domain/repositories/agenda.repository.interface';
import { LoggerService } from 'src/modules/logger/logger.service';
import { UpdateAgendaResponseDTO } from '../dtos/response/update.dto';
import { InternalUpdateAgendaDTO } from '../dtos/request/update.dto';
import { RetrieveAgendaResponseDTO } from '../dtos/response/read.dto';
import { RecurrenceGenerator } from '../../domain/services/recurrence.generator';
import { DateUtilService } from 'src/common/utils/dateUtil';

@Injectable()
export class UpdateAgendaUseCase {
  constructor(
    @Inject(IAgendaRepository)
    private readonly agendaRepo: IAgendaRepository,
    private readonly logger: LoggerService,
    private readonly dateUtil: DateUtilService,
  ) { }

  async execute(
    agendaId: string,
    dto: InternalUpdateAgendaDTO,
  ): Promise<UpdateAgendaResponseDTO> {
    try {
      const targetAgenda = await this.agendaRepo.findById(agendaId);
      if (!targetAgenda) {
        throw new NotFoundException(
          `Data agenda tidak ditemukan, gagal memperbarui data`,
        );
      }

      if (
        targetAgenda.status === 'COMPLETED' ||
        targetAgenda.status === 'CANCELLED'
      ) {
        const status =
          targetAgenda.status === 'COMPLETED' ? 'selesai' : 'dibatalkan';
        throw new BadRequestException(
          `Agenda sudah ${status}. Tidak dapat memperbarui data`,
        );
      }

      const isCurrentlyRecurring = targetAgenda.frequency != null;
      const isBecomingRecurring = dto.frequency != null;

      if (isCurrentlyRecurring || isBecomingRecurring) {
        return this.updateRecurringAgenda(agendaId, dto, targetAgenda);
      }

      const updatedAgenda = await this.agendaRepo.update(agendaId, dto);
      return updatedAgenda;
    } catch (err) {
      this.logger.error('UpdateAgendaUseCase failed', err.stack || err);
      throw err;
    }
  }

  private async updateRecurringAgenda(
    agendaId: string,
    dto: InternalUpdateAgendaDTO,
    current: RetrieveAgendaResponseDTO,
  ): Promise<UpdateAgendaResponseDTO> {
    const currentEventDate = new Date(current.eventDate);
    const newFrequency = dto.frequency;

    if (newFrequency === null) {
      const eventDate = dto.eventDate ? new Date(dto.eventDate) : currentEventDate;
      if (eventDate < new Date()) {
        throw new BadRequestException(
          'Tidak dapat menjadwalkan agenda satu kali ke tanggal yang sudah lewat',
        );
      }
      return this.agendaRepo.updateWithOccurrences(agendaId, dto, [eventDate]);
    } else {
      const until = new Date();
      until.setMonth(until.getMonth() + 6);

      const newOccurrences = RecurrenceGenerator.generate({
        startDate: dto.eventDate ?? currentEventDate,
        timezone: dto.timezone ?? current.timezone,
        frequency: newFrequency!,
        until,
      });

      return this.agendaRepo.updateWithOccurrences(
        agendaId,
        dto,
        newOccurrences,
      );
    }
  }
}
