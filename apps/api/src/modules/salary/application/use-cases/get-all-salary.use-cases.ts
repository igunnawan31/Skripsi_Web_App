import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISalaryRepository } from '../../domain/repositories/salary.repository.interface';
import { RetrieveAllSalaryResponseDTO } from '../dtos/response/read-response.dto';
import { SalaryFilterDTO } from '../dtos/request/salary-filter.dto';
import { LoggerService } from 'src/modules/logger/logger.service';
import { UserRequest } from 'src/common/types/UserRequest.dto';

@Injectable()
export class GetAllSalariesUseCase {
  constructor(
    @Inject(ISalaryRepository)
    private readonly salaryRepo: ISalaryRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(
    filters: SalaryFilterDTO,
    user: UserRequest,
  ): Promise<RetrieveAllSalaryResponseDTO> {
    this.logger.log(`${user.email} requests get all salaries data`);
    const salaries = await this.salaryRepo.findAll(filters, user);
    if (!salaries) throw new NotFoundException('Data gaji tidak ditemukan');
    return salaries;
  }
}
