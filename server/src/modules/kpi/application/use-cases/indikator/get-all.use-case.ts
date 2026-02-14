import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IIndikatorRepository } from 'src/modules/kpi/domain/repositories/indikator.repository.interface';
import { LoggerService } from 'src/modules/logger/logger.service';
import { RetrieveAllIndikatorResponseDTO } from '../../dtos/response/indikator/read-response.dto';
import {
  IndikatorFilterDTO,
  InternalIndikatorFilterDTO,
} from '../../dtos/request/indikator/filter-indicator.dto';
import { UserRequest } from 'src/common/types/UserRequest.dto';

@Injectable()
export class GetAllIndikatorUseCase {
  constructor(
    @Inject(IIndikatorRepository)
    private readonly indikatorRepo: IIndikatorRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(
    filters: IndikatorFilterDTO,
    user: UserRequest,
  ): Promise<RetrieveAllIndikatorResponseDTO> {
    try {
      this.logger.log(`${user.email} requests get all indikator`);
      const payload: InternalIndikatorFilterDTO = {
        ...filters,
        minStartDate: filters.minStartDate
          ? new Date(filters.minStartDate)
          : undefined,
        maxEndDate: filters.maxEndDate
          ? new Date(filters.maxEndDate)
          : undefined,
      };
      console.log(payload);

      const indicators = await this.indikatorRepo.findAll(payload);
      if (!indicators)
        throw new NotFoundException(`Data indikator tidak ditemukan`);
      return indicators;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
