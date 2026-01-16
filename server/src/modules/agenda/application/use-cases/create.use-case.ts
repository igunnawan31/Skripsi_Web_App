import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IAgendaRepository } from '../../domain/repositories/agenda.repository.interface';
import { LoggerService } from 'src/modules/logger/logger.service';
import { CreateAgendaResponseDTO } from '../dtos/response/create.dto';
import {
  CreateAgendaDTO,
  InternalCreateAgendaDTO,
} from '../dtos/request/create.dto';
import { IProjectRepository } from 'src/modules/project/domain/repositories/project.repository.interface';
import { ALLOWED_TIMEZONES } from 'src/common/types/timezone';
import { DateUtilService } from 'src/common/utils/dateUtil';
import { RecurrenceGenerator } from '../../domain/services/recurrence.generator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CreateAgendaUseCase {
  private readonly timezone: string;
  constructor(
    @Inject(IAgendaRepository)
    private readonly agendaRepo: IAgendaRepository,
    @Inject(IProjectRepository)
    private readonly projectRepo: IProjectRepository,
    private readonly logger: LoggerService,
    private readonly dateUtil: DateUtilService,
    private readonly configService: ConfigService,
  ) {
    this.timezone = this.configService.getOrThrow<string>('TZ', 'Asia/Jakarta')
  }

  async execute(dto: CreateAgendaDTO): Promise<CreateAgendaResponseDTO> {
    try {
      if (dto.timezone && !ALLOWED_TIMEZONES.includes(dto.timezone)) {
        throw new BadRequestException(
          'Hanya timezone Asia/Jakarta yang didukung',
        );
      }

      if (dto.projectId) {
        const project = await this.projectRepo.findById(dto.projectId);
        if (!project) {
          throw new NotFoundException(
            `Data project tidak ditemukan, gagal membuat agenda`,
          );
        }
      }

      const eventDate = this.dateUtil.parseDate(dto.eventDate);
      const now = new Date();

      if (!dto.frequency && eventDate < now) {
        throw new BadRequestException(
          `Tidak dapat mengajukan untuk tanggal yang sudah lewat`,
        );
      }

      const payload: InternalCreateAgendaDTO = {
        ...dto,
        timezone: dto.timezone ?? this.timezone,
        eventDate,
      };
      let occurrences: Date[] = [];
      if (dto.frequency) {
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

        occurrences = RecurrenceGenerator.generate({
          startDate: eventDate,
          timezone: dto.timezone ?? this.timezone,
          frequency: dto.frequency,
          until: sixMonthsFromNow,
        });
      } else {
        occurrences = [eventDate];
      }
      const agenda = await this.agendaRepo.create(payload, occurrences);
      return agenda;
    } catch (err) {
      this.logger.error(err, 'CreateAgendaUseCase');
      throw err;
    }
  }
}
