import { BadRequestException, Injectable } from '@nestjs/common';
import { KontrakKerjaStatus, MetodePembayaran } from '@prisma/client';
import { RetrieveKontrakResponseDTO } from 'src/kontrak/application/dtos/response/read-response.dto';

@Injectable()
export class KontrakValidationService {

  assertValidDates(
    startDate: Date,
    endDate?: Date,
  ) {
    if (endDate && endDate < startDate) {
      throw new BadRequestException('Tanggal selesai tidak boleh lebih awal dari tanggal mulai')
    }
  }

  assertValidTerminPercentage(
    metodePembayaran: MetodePembayaran,
    dpPercentage?: number,
    finalPercentage?: number,
  ){
    if (metodePembayaran === MetodePembayaran.TERMIN) {
      if (!dpPercentage || !finalPercentage) {
        throw new BadRequestException('DP dan Final percentage harus diisi untuk metode TERMIN')
      }

      if (dpPercentage + finalPercentage !== 100) {
        throw new BadRequestException('Total DP dan Final percentage harus 100%')
      }
    }
  }

  canEndContract(kontrak: RetrieveKontrakResponseDTO): boolean {
    return kontrak.status === KontrakKerjaStatus.ACTIVE;
  }
}
