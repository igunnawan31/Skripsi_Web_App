import { Inject, Injectable } from '@nestjs/common';
import { ISalaryRepository } from '../../domain/repositories/salary.repository.interface';
import { CreateSalaryDTO } from '../dtos/request/create-salary.dto';
import { SalaryCreatedEvent } from '../events/gaji.events';

@Injectable()
export class CreateSalaryUseCase {
  constructor(
    @Inject(ISalaryRepository)
    private readonly salaryRepo: ISalaryRepository,
  ) {}

  async execute(data: CreateSalaryDTO): Promise<void> {
    await this.salaryRepo.create(data);
  }
}
