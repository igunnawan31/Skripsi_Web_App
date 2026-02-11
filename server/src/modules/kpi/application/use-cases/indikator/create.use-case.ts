import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateIndikatorResponseDTO } from '../../dtos/response/indikator/create-response.dto';
import {
  CreateIndikatorDTO,
  InternalCreateEvaluationsDTO,
  InternalCreateIndikatorDTO,
} from '../../dtos/request/indikator/create-indicator.dto';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { IIndikatorRepository } from 'src/modules/kpi/domain/repositories/indikator.repository.interface';
import { LoggerService } from 'src/modules/logger/logger.service';
import { DateUtilService } from 'src/common/utils/dateUtil';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CreateIndikatorUseCase {
  private readonly timezone: string;
  constructor(
    @Inject(IIndikatorRepository)
    private readonly indikatorRepo: IIndikatorRepository,
    private readonly logger: LoggerService,
    private readonly dateUtil: DateUtilService,
    private readonly configService: ConfigService,
  ) {
    this.timezone = this.configService.getOrThrow<string>('TZ', 'Asia/Jakarta');
  }

  async execute(
    dto: CreateIndikatorDTO,
    user: UserRequest,
  ): Promise<CreateIndikatorResponseDTO> {
    try {
      const formattedStartDate = this.dateUtil.parseDate(dto.startDate);
      const formattedEndDate = this.dateUtil.parseDate(dto.endDate);
      const now = new Date();

      if (formattedStartDate < now) {
        throw new BadRequestException(
          `Tidak dapat membuat indikator untuk tanggal yang sudah lewat`,
        );
      }

      const indikatorPayload: InternalCreateIndikatorDTO = {
        name: dto.name,
        description: dto.description,
        category: dto.category,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        statusPublic: dto.statusPublic ?? false,
        status: dto.status ?? 'DRAFT',
        createdById: user.id,
      };

      const evaluationData: InternalCreateEvaluationsDTO[] =
        dto.evalMap?.flatMap((map) =>
          map.evaluateeId.map((evaluateeId) => ({
            indikatorId: '',
            evaluatorId: map.evaluatorId,
            evaluateeId,
          })),
        ) ?? [];

      return await this.indikatorRepo.createWithEval(
        indikatorPayload,
        evaluationData,
      );
    } catch (err) {
      this.logger.error(err, 'CreateIndikatorUseCase');
      throw err;
    }
  }
}
