import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IPertanyaanRepository } from "src/modules/kpi/domain/repositories/pertanyaan.repository.interface";
import { LoggerService } from "src/modules/logger/logger.service";
import { RetrievePertanyaanResponseDTO } from "../../dtos/response/pertanyaan/read-response.dto";

@Injectable()
export class GetPertanyaanUseCase {
  constructor(
    @Inject(IPertanyaanRepository)
    private readonly pertanyaanRepo: IPertanyaanRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(id: string): Promise<RetrievePertanyaanResponseDTO> {
    try {
      const question = await this.pertanyaanRepo.findById(id);
      if (!question)
        throw new NotFoundException(`Data pertanyaan tidak ditemukan`);
      return question;
    } catch (err) { 
      this.logger.error(err);
      throw err;
    }
  }
}
