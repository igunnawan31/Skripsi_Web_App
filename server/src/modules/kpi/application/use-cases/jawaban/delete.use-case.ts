import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IJawabanRepository } from "src/modules/kpi/domain/repositories/jawaban.repository.interface";
import { LoggerService } from "src/modules/logger/logger.service";

@Injectable()
export class DeleteJawabanUseCase {
  constructor(
    @Inject(IJawabanRepository)
    private readonly jawabanRepo: IJawabanRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(id: string): Promise<void> {
    try {
      const targetJawaban = await this.jawabanRepo.findById(id);
      if (!targetJawaban)
        throw new NotFoundException(
          `Data jawaban tidak ditemukan, gagal menghapus jawaban`,
        );

      await this.jawabanRepo.remove(id);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
