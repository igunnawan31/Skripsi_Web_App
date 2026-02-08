import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IIndikatorRepository } from 'src/modules/kpi/domain/repositories/indikator.repository.interface';
import { RetrieveIndikatorResponseDTO } from '../../dtos/response/indikator/read-response.dto';
import { LoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class GetIndikatorUseCase {
  constructor(
    @Inject(IIndikatorRepository)
    private readonly indikatorRepo: IIndikatorRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(id: string): Promise<RetrieveIndikatorResponseDTO> {
    try {
      const indicator = await this.indikatorRepo.findById(id);
      if (!indicator)
        throw new NotFoundException(`Data indikator tidak ditemukan`);
      return indicator;
    } catch (err) { 
      this.logger.error(err);
      throw err;
    }
  }
}
