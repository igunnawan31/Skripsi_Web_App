import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { IReimburseRepository } from 'src/reimburse/domain/repositories/reimburse.repository.interface';
import { CreateReimburseResponseDTO } from '../dtos/response/create.dto';
import { InternalCreateReimburseDTO } from '../dtos/request/create.dto';
@Injectable()
export class SubmitReimburseUseCase {
  constructor(
    @Inject(IReimburseRepository)
    private readonly reimburseRepo: IReimburseRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(
    dto: InternalCreateReimburseDTO,
  ): Promise<CreateReimburseResponseDTO> {
    try {
      const reimburse = await this.reimburseRepo.create(dto);
      return reimburse;
    } catch (err) { 
      throw err;
    }
  }
}
