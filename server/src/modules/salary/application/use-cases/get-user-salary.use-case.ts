import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISalaryRepository } from '../../domain/repositories/salary.repository.interface';
import { RetrieveAllSalaryResponseDTO } from '../dtos/response/read-response.dto';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { LoggerService } from 'src/modules/logger/logger.service';
import { SalaryFilterDTO } from '../dtos/request/salary-filter.dto';

@Injectable()
export class GetUserSalariesUseCase {
  constructor(
    @Inject(ISalaryRepository)
    private readonly salaryRepo: ISalaryRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(
    userId: string,
    filters: SalaryFilterDTO,
    user: UserRequest,
  ): Promise<RetrieveAllSalaryResponseDTO> {
    this.logger.log(`${user.email} requests get user ${userId} salaries`);
    const salaries = await this.salaryRepo.findByUserId(userId, filters);
    if (!salaries) throw new NotFoundException('Data gaji tidak ditemukan');
    return salaries;
  }
}
