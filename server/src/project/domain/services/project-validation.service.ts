import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectValidationService {
  validateDates(startDate: Date, endDate?: Date): {
    valid: boolean;
    message: string;
  } {
    if (endDate && endDate < startDate) {
      return {
        valid: false,
        message: 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai',
      };
    }

    return { valid: true, message: 'Tanggal valid' };
  }
}
