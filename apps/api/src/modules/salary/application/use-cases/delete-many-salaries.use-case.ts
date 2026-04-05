import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ISalaryRepository } from '../../domain/repositories/salary.repository.interface';
import { LoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class DeleteManySalariesUseCase {
  constructor(
    private readonly salaryRepo: ISalaryRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(userId: string, kontrakId: string) {
    const targetSalaries = await this.salaryRepo.findByUserIdAndKontrakId(
      userId,
      kontrakId,
    );
    if (!targetSalaries)
      throw new NotFoundException('Data gaji tidak ditemukan');

    targetSalaries.forEach((salary) => {
      if (salary.status === 'PAID')
        throw new BadRequestException(
          'Terdapat gaji yang sudah dibayar, record tidak dapat diupdate',
        );
    });

    // Compare month, if its already the 2nd month then throw error
    const [year, month] = targetSalaries[0].periode.split('-').map(Number);

    const today = new Date();

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    // difference in months
    const diffInMonths = (currentYear - year) * 12 + (currentMonth - month);

    if (diffInMonths >= 1) {
      throw new BadRequestException(
        'Telah melewati batas pengubahan data gaji, hanya dapat dilakukan di bulan pertama',
      );
    }

    await this.salaryRepo.removeBulk(userId, kontrakId);
  }
}
