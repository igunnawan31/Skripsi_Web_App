import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IJawabanRepository } from 'src/modules/kpi/domain/repositories/jawaban.repository.interface';
import { LoggerService } from 'src/modules/logger/logger.service';
import { CreateJawabanResponseDTO } from '../../dtos/response/jawaban/create-response.dto';
import {
  CreateJawabanDTO,
  InternalCreateJawabanDTO,
} from '../../dtos/request/jawaban/create-answer.dto';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { IPertanyaanRepository } from 'src/modules/kpi/domain/repositories/pertanyaan.repository.interface';

@Injectable()
export class CreateJawabanUseCase {
  constructor(
    @Inject(IJawabanRepository)
    private readonly jawabanRepo: IJawabanRepository,
    @Inject(IPertanyaanRepository)
    private readonly pertanyaanRepo: IPertanyaanRepository,
    private readonly logger: LoggerService,
  ) { }

  async execute(
    data: CreateJawabanDTO,
    user: UserRequest,
  ): Promise<CreateJawabanResponseDTO> {
    try {
      const question = await this.pertanyaanRepo.findById(data.pertanyaanId);

      if (!question)
        throw new NotFoundException(
          `Pertanyaan tidak ditemukan, gagal membuat jawaban`,
        );
      const answer = await this.jawabanRepo.findUnique(
        data.pertanyaanId,
        user.id,
        data.evaluateeId,
      );
      if (answer)
        throw new BadRequestException(`Tidak dapat membuat jawaban lagi`);

      const payload: InternalCreateJawabanDTO = {
        indikatorId: data.indikatorId,
        pertanyaanId: data.pertanyaanId,
        evaluatorId: user.id,
        evaluateeId: data.evaluateeId,
        notes: data.notes ?? undefined,
        nilai: data.nilai * question?.bobot,
      };

      const jawaban = await this.jawabanRepo.create(payload);
      return jawaban;
    } catch (err) {
      this.logger.error(err, 'CreateJawabanUseCase');
      throw err;
    }
  }
}
