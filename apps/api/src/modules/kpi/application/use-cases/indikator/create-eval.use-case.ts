import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { IIndikatorRepository } from 'src/modules/kpi/domain/repositories/indikator.repository.interface';
import { LoggerService } from 'src/modules/logger/logger.service';
import { RetrieveIndikatorResponseDTO } from '../../dtos/response/indikator/read-response.dto';
import {
  EvalMapDTO,
  InternalCreateEvaluationsDTO,
} from '../../dtos/request/indikator/create-indicator.dto';

@Injectable()
export class CreateEvaluationsUseCase {
  constructor(
    @Inject(IIndikatorRepository)
    private readonly indikatorRepo: IIndikatorRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(
    id: string,
    dto: EvalMapDTO[],
  ): Promise<RetrieveIndikatorResponseDTO> {
    try {
      const indikator = await this.indikatorRepo.findById(id);
      if (!indikator)
        throw new NotFoundException(`Data indikator tidak ditemukan`);
      const evaluationData: InternalCreateEvaluationsDTO[] =
        dto.flatMap((map) =>
          map.evaluateeId.map((evaluateeId) => ({
            indikatorId: id,
            evaluatorId: map.evaluatorId,
            evaluateeId,
          })),
        ) ?? [];

      await this.indikatorRepo.createEval(evaluationData);
      const updated = await this.indikatorRepo.findById(id);
      if (!updated) {
        throw new InternalServerErrorException(
          'Indikator unexpectedly missing after evaluation creation',
        );
      }
      return updated;
    } catch (err) {
      this.logger.error(err, 'CreateEvaluationsUseCase');
      throw err;
    }
  }
}
