import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ISalaryRepository } from '../../domain/repositories/salary.repository.interface';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { LoggerService } from 'src/modules/logger/logger.service';
import { InternalUpdateSalaryDTO } from '../dtos/request/update-salary.dto';
import { UpdateSalaryResponseDTO } from '../dtos/response/update-response.dto';
import { FileMetaData } from 'src/common/types/FileMetaData.dto';

@Injectable()
export class PaySalaryUseCase {
  constructor(
    @Inject(ISalaryRepository)
    private readonly salaryRepo: ISalaryRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(
    id: string,
    paychecks: FileMetaData[],
    user: UserRequest,
  ): Promise<UpdateSalaryResponseDTO> {
    this.logger.log(`${user.email} requests pay salary ${id}`);
    const targetSalary = await this.salaryRepo.findById(id);
    if (!targetSalary) throw new NotFoundException('Data gaji tidak ditemukan');
    if (targetSalary.status === 'PAID')
      throw new BadRequestException(
        'Gaji telah dibayarkan, gagal melakukan pembayaran',
      );
    const payload: InternalUpdateSalaryDTO = {
      paymentDate: new Date(),
      paychecks: paychecks,
      status: 'PAID',
    };
    const updatedSalary = await this.salaryRepo.update(id, payload);
    return updatedSalary;
  }
}
