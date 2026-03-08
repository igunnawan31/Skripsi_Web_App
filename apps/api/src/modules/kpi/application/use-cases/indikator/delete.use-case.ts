import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { IIndikatorRepository } from 'src/modules/kpi/domain/repositories/indikator.repository.interface';
import { LoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class DeleteIndikatorUseCase {
  constructor(
    @Inject(IIndikatorRepository)
    private readonly indikatorRepo: IIndikatorRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(id: string): Promise<void> {
    try {
      const targetIndicator = await this.indikatorRepo.findById(id);
      if (!targetIndicator)
        throw new NotFoundException(
          `Data indikator tidak ditemukan, gagal menghapus indikator`,
        );

      await this.indikatorRepo.remove(id);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
