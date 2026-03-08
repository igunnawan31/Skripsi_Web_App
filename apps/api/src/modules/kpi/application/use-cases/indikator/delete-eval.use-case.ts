import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { IIndikatorRepository } from 'src/modules/kpi/domain/repositories/indikator.repository.interface';
import { LoggerService } from 'src/modules/logger/logger.service';
import { DeleteEvaluationDTO } from '../../dtos/request/indikator/delete-evaluation.dto';

@Injectable()
export class DeleteIndikatorEvaluationUseCase {
  constructor(
    @Inject(IIndikatorRepository)
    private readonly indikatorRepo: IIndikatorRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(id, dto: DeleteEvaluationDTO): Promise<void> {
    try {
      const { indikatorId, evaluatorId, evaluateeId } = dto;
      const targetIndicator = await this.indikatorRepo.findById(id);
      if (!targetIndicator)
        throw new NotFoundException(
          `Data indikator tidak ditemukan, gagal menghapus evaluation`,
        );

      const targetEvaluation = await this.indikatorRepo.findUniqueEval(
        indikatorId,
        evaluateeId,
        evaluatorId,
      );
      if (!targetEvaluation)
        throw new NotFoundException(
          `Data evaluation tidak ditemukan, gagal menghapus evaluation`,
        );

      await this.indikatorRepo.removeEval(
        indikatorId,
        evaluateeId,
        evaluatorId,
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
