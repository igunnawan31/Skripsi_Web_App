import { Inject, Injectable } from '@nestjs/common';
import { IRekapRepository } from 'src/modules/kpi/domain/repositories/rekap.repository.interface';
import { LoggerService } from 'src/modules/logger/logger.service';
import { RetrieveAllIndikatorRekapResponseDTO } from '../../dtos/response/rekap/read-response.dto';
import {
  InternalRekapFilterDTO,
  RekapFilterDTO,
} from '../../dtos/request/rekap/filter-rekap.dto';

@Injectable()
export class GetAllIndikatorRekapUseCase {
  constructor(
    @Inject(IRekapRepository)
    private readonly rekapRepo: IRekapRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(
    userId: string,
    filters: RekapFilterDTO,
  ): Promise<RetrieveAllIndikatorRekapResponseDTO | null> {
    try {
      const payload: InternalRekapFilterDTO = {
        ...filters,
        userId,
        minCreatedAt: filters.minCreatedAt
          ? new Date(filters.minCreatedAt)
          : undefined,
        maxCreatedAt: filters.maxCreatedAt
          ? new Date(filters.maxCreatedAt)
          : undefined,
      };
      const recaps = await this.rekapRepo.findAll(payload);
      if (!recaps) return null;
      return recaps;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
