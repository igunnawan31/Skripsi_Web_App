import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectValidationService {
  validateDates(
    startDate: Date,
    endDate?: Date,
  ): {
    valid: boolean;
    message: string;
  } {
    if (endDate && endDate < startDate) {
      return {
        valid: false,
        message: 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai',
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      return {
        valid: false,
        message:
          'Tidak dapat membuat project baru untuk tanggal yang sudah lewat',
      };
    }

    return { valid: true, message: 'Tanggal valid' };
  }
}
