import { Inject, Injectable } from "@nestjs/common";
import { IPertanyaanRepository } from "src/modules/kpi/domain/repositories/pertanyaan.repository.interface";
import { LoggerService } from "src/modules/logger/logger.service";
import { CreatePertanyaanDTO } from "../../dtos/request/pertanyaan/create-question.dto";
import { UserRequest } from "src/common/types/UserRequest.dto";
import { CreatePertanyaanResponseDTO } from "../../dtos/response/pertanyaan/create-response.dto";

@Injectable()
export class CreatePertanyaanUseCase {
  constructor(
    @Inject(IPertanyaanRepository)
    private readonly pertanyaanRepo: IPertanyaanRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(
    data: CreatePertanyaanDTO,
    user: UserRequest,
  ): Promise<CreatePertanyaanResponseDTO> {
    try {
      const pertanyaan = await this.pertanyaanRepo.create(data);
      return pertanyaan;
    } catch (err) {
      this.logger.error(err, 'CreatePertanyaanUseCase');
      throw err;
    }
  }
}
