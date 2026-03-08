import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ISalaryRepository } from '../../domain/repositories/salary.repository.interface';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { deleteFileArray } from 'src/common/utils/fileHelper';
import { LoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class DeleteSalaryUseCase {
  constructor(
    private readonly salaryRepo: ISalaryRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(id: string, user: UserRequest) {
    this.logger.log(`${user.email} requests delete salary ${id}`);
    const targetSalary = await this.salaryRepo.findById(id);
    if (!targetSalary) throw new NotFoundException('Data gaji tidak ditemukan');

    if (targetSalary.status === 'PAID') {
      throw new BadRequestException(
        'Status gaji sudah dibayar, record tidak dapat dihapus',
      );
    }

    if (targetSalary.paychecks) {
      await deleteFileArray(targetSalary.paychecks, 'Paycheck');
    }

    await this.salaryRepo.remove(id);
  }
}
