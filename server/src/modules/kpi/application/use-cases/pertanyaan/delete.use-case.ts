import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IPertanyaanRepository } from "src/modules/kpi/domain/repositories/pertanyaan.repository.interface";
import { LoggerService } from "src/modules/logger/logger.service";

@Injectable()
export class DeletePertanyaanUseCase {
  constructor(
    @Inject(IPertanyaanRepository)
    private readonly pertanyaanRepo: IPertanyaanRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(id: string): Promise<void> {
    try {
      const targetPertanyaan = await this.pertanyaanRepo.findById(id);
      if (!targetPertanyaan)
        throw new NotFoundException(
          `Data pertanyaan tidak ditemukan, gagal menghapus pertanyaan`,
        );

      await this.pertanyaanRepo.remove(id);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
