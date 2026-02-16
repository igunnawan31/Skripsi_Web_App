import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IIndikatorRepository } from 'src/modules/kpi/domain/repositories/indikator.repository.interface';
import { LoggerService } from 'src/modules/logger/logger.service';
import { UpdateIndikatorResponseDTO } from '../../dtos/response/indikator/update-response.dto';
import {
  InternalUpdateIndikatorDTO,
  UpdateIndikatorDTO,
} from '../../dtos/request/indikator/update-indicator.dto';
import { DateUtilService } from 'src/common/utils/dateUtil';

@Injectable()
export class UpdateIndikatorUseCase {
  constructor(
    @Inject(IIndikatorRepository)
    private readonly indikatorRepo: IIndikatorRepository,
    private readonly logger: LoggerService,
    private readonly dateUtil: DateUtilService,
  ) { }

  async execute(
    id: string,
    data: UpdateIndikatorDTO,
  ): Promise<UpdateIndikatorResponseDTO> {
    try {
      const targetIndicator = await this.indikatorRepo.findById(id);
      if (!targetIndicator)
        throw new NotFoundException(
          `Data indikator tidak ditemukan, gagal menghapus indikator`,
        );

      if (targetIndicator.status === 'ACTIVE')
        throw new BadRequestException(
          `Indikator tidak dapat diperbarui karena sedang aktif`,
        );

      const formattedStartDate = data.startDate
        ? this.dateUtil.parseDate(data.startDate)
        : undefined;
      const formattedEndDate = data.endDate
        ? this.dateUtil.parseDate(data.endDate)
        : undefined;

      const now = new Date();

      if (formattedStartDate && formattedStartDate < now) {
        throw new BadRequestException(
          `Tidak dapat membuat indikator untuk tanggal yang sudah lewat`,
        );
      }
      const payload: InternalUpdateIndikatorDTO = {
        ...data,
        startDate: data.startDate ? formattedStartDate : undefined,
        endDate: data.endDate ? formattedEndDate : undefined,
      };

      const updatedIndicator = await this.indikatorRepo.update(id, payload);
      return updatedIndicator;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
