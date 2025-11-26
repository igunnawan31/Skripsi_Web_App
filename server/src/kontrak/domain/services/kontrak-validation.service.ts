import { Injectable } from '@nestjs/common';
import { KontrakKerjaStatus, MetodePembayaran } from '@prisma/client';
import { RetrieveKontrakResponseDTO } from 'src/kontrak/application/dtos/response/read-response.dto';

@Injectable()
export class KontrakValidationService {
  validateDates(tanggalMulai: Date, tanggalSelesai?: Date): {
    valid: boolean;
    message: string;
  } {
    if (tanggalSelesai && tanggalSelesai < tanggalMulai) {
      return {
        valid: false,
        message: 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai',
      };
    }

    return { valid: true, message: 'Tanggal valid' };
  }

  validateTerminPercentage(metodePembayaran: MetodePembayaran, dpPercentage?: number, finalPercentage?: number): {
    valid: boolean;
    message: string;
  } {
    if (metodePembayaran === MetodePembayaran.TERMIN) {
      if (!dpPercentage || !finalPercentage) {
        return {
          valid: false,
          message: 'DP dan Final percentage harus diisi untuk metode TERMIN',
        };
      }

      if (dpPercentage + finalPercentage !== 100) {
        return {
          valid: false,
          message: 'Total DP dan Final percentage harus 100%',
        };
      }
    }

    return { valid: true, message: 'Percentage valid' };
  }

  canEndContract(kontrak: RetrieveKontrakResponseDTO): boolean {
    return kontrak.status === KontrakKerjaStatus.AKTIF;
  }
}
