import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { RetrieveReimburseResponseDTO } from '../dtos/response/read.dto';
import { IReimburseRepository } from '../../domain/repositories/reimburse.repository.interface';
import { LoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class GetReimburseUseCase {
  constructor(
    @Inject(IReimburseRepository)
    private readonly reimburseRepo: IReimburseRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(
    id: string,
    user: UserRequest,
  ): Promise<RetrieveReimburseResponseDTO> {
    this.logger.log(
      `${user.email} requests get reimburse ${id}`,
    );
    const reimburse = await this.reimburseRepo.findById(id);

    if (!reimburse)
      throw new NotFoundException('Data reimburse tidak ditemukan');

    return reimburse;
  }
}
