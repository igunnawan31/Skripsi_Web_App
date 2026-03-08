import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UserRequest } from "src/common/types/UserRequest.dto";
import { DateUtilService } from "src/common/utils/dateUtil";
import { IJawabanRepository } from "src/modules/kpi/domain/repositories/jawaban.repository.interface";
import { LoggerService } from "src/modules/logger/logger.service";
import { RetrieveJawabanResponseDTO } from "../../dtos/response/jawaban/read-response.dto";

@Injectable()
export class GetJawabanByIndikatorIdAndEvaluateeIdUseCase {
  constructor(
    @Inject(IJawabanRepository)
    private readonly jawabanRepo: IJawabanRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(
    indikatorId: string,
    evaluateeId: string,
    user: UserRequest,
  ): Promise<RetrieveJawabanResponseDTO[]> {
    try {
      this.logger.log(`${user.email} requests get all jawaban`);
      const indicators = await this.jawabanRepo.findByIndikatorIdAndUserId(indikatorId, evaluateeId);
      if (!indicators)
        throw new NotFoundException(`Data indikator tidak ditemukan`);
      return indicators;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
