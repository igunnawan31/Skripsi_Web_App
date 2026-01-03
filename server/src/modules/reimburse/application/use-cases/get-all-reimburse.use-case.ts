import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { RetrieveAllReimburseResponseDTO } from '../dtos/response/read.dto';
import { InternalReimburseFilterDTO, ReimburseFilterDTO } from '../dtos/request/filter.dto';
import { IReimburseRepository } from '../../domain/repositories/reimburse.repository.interface';
import { LoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class GetAllReimburseUseCase {
  constructor(
    @Inject(IReimburseRepository)
    private readonly reimburseRepo: IReimburseRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(
    filters: ReimburseFilterDTO,
    user: UserRequest,
  ): Promise<RetrieveAllReimburseResponseDTO> {
    this.logger.log(
      `${user.email} requests get all reimburse`,
    );
    const payload: InternalReimburseFilterDTO = {
      ...filters,
      minSubmittedDate: filters.minSubmittedDate ? new Date(filters.minSubmittedDate) : undefined,
      maxSubmittedDate: filters.maxSubmittedDate ? new Date(filters.maxSubmittedDate) : undefined,
    }
    const reimburses = await this.reimburseRepo.findAll(payload, user);
    if (!reimburses)
      throw new NotFoundException('Data reimburse tidak ditemukan');

    return reimburses;
  }
}
