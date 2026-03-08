import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DateUtilService } from 'src/common/utils/dateUtil';
import { IPertanyaanRepository } from 'src/modules/kpi/domain/repositories/pertanyaan.repository.interface';
import { LoggerService } from 'src/modules/logger/logger.service';
import { UpdatePertanyaanDTO } from '../../dtos/request/pertanyaan/update-question.dto';
import { UpdatePertanyaanResponseDTO } from '../../dtos/response/pertanyaan/update-response.dto';

@Injectable()
export class UpdatePertanyaanUseCase {
  constructor(
    @Inject(IPertanyaanRepository)
    private readonly pertanyaanRepo: IPertanyaanRepository,
    private readonly logger: LoggerService,
    private readonly dateUtil: DateUtilService,
  ) { }

  async execute(
    id: string,
    data: UpdatePertanyaanDTO,
  ): Promise<UpdatePertanyaanResponseDTO> {
    try {
      const targetPertanyaan = await this.pertanyaanRepo.findById(id);
      if (!targetPertanyaan)
        throw new NotFoundException(
          `Data pertanyaan tidak ditemukan, gagal menghapus pertanyaan`,
        );
      const updatedPertanyaan = await this.pertanyaanRepo.update(id, data);
      return updatedPertanyaan;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
