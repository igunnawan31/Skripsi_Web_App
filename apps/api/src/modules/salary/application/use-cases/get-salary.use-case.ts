import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISalaryRepository } from '../../domain/repositories/salary.repository.interface';
import { RetrieveSalaryResponseDTO } from '../dtos/response/read-response.dto';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { LoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class GetSalaryUseCase {
  constructor(
    @Inject(ISalaryRepository)
    private readonly salaryRepo: ISalaryRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(
    id: string,
    user: UserRequest,
  ): Promise<RetrieveSalaryResponseDTO> {
    this.logger.log(`${user.email} requests get salary ${id}`);
    const salary = await this.salaryRepo.findById(id);
    if (!salary) throw new NotFoundException('Data gaji tidak ditemukan');
    return salary;
  }
}

