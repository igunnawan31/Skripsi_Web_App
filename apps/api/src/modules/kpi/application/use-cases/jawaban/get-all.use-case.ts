import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IJawabanRepository } from "src/modules/kpi/domain/repositories/jawaban.repository.interface";
import { LoggerService } from "src/modules/logger/logger.service";
import { InternalJawabanFilterDTO, JawabanFilterDTO } from "../../dtos/request/jawaban/filter-answer.dto";
import { UserRequest } from "src/common/types/UserRequest.dto";
import { RetrieveAllJawabanResponseDTO } from "../../dtos/response/jawaban/read-response.dto";
import { DateUtilService } from "src/common/utils/dateUtil";

@Injectable()
export class GetAllJawabanUseCase {
  constructor(
    @Inject(IJawabanRepository)
    private readonly jawabanRepo: IJawabanRepository,
    private readonly logger: LoggerService,
    private readonly dateUtil: DateUtilService,
  ) { }

  async execute(
    filters: JawabanFilterDTO,
    user: UserRequest,
  ): Promise<RetrieveAllJawabanResponseDTO> {
    try {
      this.logger.log(`${user.email} requests get all jawaban`);
      const formattedMaxDate = filters.maxCreatedDate ? this.dateUtil.parseDate(filters.maxCreatedDate) : undefined;
      const formattedMinDate = filters.minCreatedDate ? this.dateUtil.parseDate(filters.minCreatedDate) : undefined;
      const payload: InternalJawabanFilterDTO = {
        maxCreatedDate: formattedMaxDate,
        minCreatedDate: formattedMinDate,
      }
      const indicators = await this.jawabanRepo.findAll(payload);
      if (!indicators)
        throw new NotFoundException(`Data indikator tidak ditemukan`);
      return indicators;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
