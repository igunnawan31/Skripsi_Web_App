import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IJawabanRepository } from "src/modules/kpi/domain/repositories/jawaban.repository.interface";
import { LoggerService } from "src/modules/logger/logger.service";
import { RetrieveJawabanResponseDTO } from "../../dtos/response/jawaban/read-response.dto";

@Injectable()
export class GetJawabanUseCase {
  constructor(
    @Inject(IJawabanRepository)
    private readonly jawabanRepo: IJawabanRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(id: string): Promise<RetrieveJawabanResponseDTO> {
    try {
      const answer = await this.jawabanRepo.findById(id);
      if (!answer)
        throw new NotFoundException(`Data jawaban tidak ditemukan`);
      return answer;
    } catch (err) { 
      this.logger.error(err);
      throw err;
    }
  }
}
