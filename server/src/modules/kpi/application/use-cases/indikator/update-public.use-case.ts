import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DateUtilService } from "src/common/utils/dateUtil";
import { IIndikatorRepository } from "src/modules/kpi/domain/repositories/indikator.repository.interface";
import { LoggerService } from "src/modules/logger/logger.service";
import { UpdateIndikatorResponseDTO } from "../../dtos/response/indikator/update-response.dto";
import { InternalUpdateIndikatorDTO } from "../../dtos/request/indikator/update-indicator.dto";

@Injectable()
export class UpdatePublicIndikatorUseCase {
  constructor(
    @Inject(IIndikatorRepository)
    private readonly indikatorRepo: IIndikatorRepository,
    private readonly logger: LoggerService,
    private readonly dateUtil: DateUtilService,
  ) { }

  async execute(
    id: string,
    status: boolean,
  ): Promise<UpdateIndikatorResponseDTO> {
    try {
      const targetIndicator = await this.indikatorRepo.findById(id);
      if (!targetIndicator)
        throw new NotFoundException(
          `Data indikator tidak ditemukan, gagal menghapus indikator`,
        );

      const payload: InternalUpdateIndikatorDTO = {
        statusPublic: status,
      };

      const updatedIndicator = await this.indikatorRepo.update(id, payload);
      return updatedIndicator;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
