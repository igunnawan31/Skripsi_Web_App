import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { RetrieveAllReimburseResponseDTO } from '../dtos/response/read.dto';
import {
  InternalReimburseFilterDTO,
  ReimburseFilterDTO,
} from '../dtos/request/filter.dto';
import { IReimburseRepository } from '../../domain/repositories/reimburse.repository.interface';
import { LoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class GetUserAllReimburseUseCase {
  constructor(
    @Inject(IReimburseRepository)
    private readonly reimburseRepo: IReimburseRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(
    filters: ReimburseFilterDTO,
    userId: string,
    user: UserRequest,
  ): Promise<RetrieveAllReimburseResponseDTO> {
    this.logger.log(`${user.email} requests get ${userId}'s all reimburses`);
    if (
      userId !== user.id &&
      user.minorRole !== 'ADMIN' &&
      user.majorRole !== 'OWNER'
    ) {
      throw new UnauthorizedException(
        'User tidak memiliki akses untuk data yang diminta',
      );
    }
    const payload: InternalReimburseFilterDTO = {
      ...filters,
      minSubmittedDate: filters.minSubmittedDate
        ? new Date(filters.minSubmittedDate)
        : undefined,
      maxSubmittedDate: filters.maxSubmittedDate
        ? new Date(filters.maxSubmittedDate)
        : undefined,
    };
    const reimburses = await this.reimburseRepo.findAllByUserId(
      payload,
      userId,
    );
    if (!reimburses)
      throw new NotFoundException('Data reimburse tidak ditemukan');

    return reimburses;
  }
}
