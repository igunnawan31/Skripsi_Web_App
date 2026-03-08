import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DateUtilService } from "src/common/utils/dateUtil";
import { IPertanyaanRepository } from "src/modules/kpi/domain/repositories/pertanyaan.repository.interface";
import { LoggerService } from "src/modules/logger/logger.service";
import { PertanyaanFilterDTO } from "../../dtos/request/pertanyaan/filter-question.dto";
import { UserRequest } from "src/common/types/UserRequest.dto";
import { RetrieveAllPertanyaanResponseDTO } from "../../dtos/response/pertanyaan/read-response.dto";

@Injectable()
export class GetAllPertanyaanUseCase {
  constructor(
    @Inject(IPertanyaanRepository)
    private readonly pertanyaanRepo: IPertanyaanRepository,
    private readonly logger: LoggerService,
    private readonly dateUtil: DateUtilService,
  ) { }

  async execute(
    filters: PertanyaanFilterDTO,
    user: UserRequest,
  ): Promise<RetrieveAllPertanyaanResponseDTO> {
    try {
      this.logger.log(`${user.email} requests get all pertanyaan`);
      const questions = await this.pertanyaanRepo.findAll(filters);
      if (!questions)
        throw new NotFoundException(`Data pertanyaan tidak ditemukan`);
      return questions;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
