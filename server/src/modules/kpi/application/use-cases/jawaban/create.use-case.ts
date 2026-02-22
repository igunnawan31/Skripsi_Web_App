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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JawabanSubmitEvent } from '../../events/jawaban.events';

@Injectable()
export class CreateJawabanUseCase {
  constructor(
    @Inject(IJawabanRepository)
    private readonly jawabanRepo: IJawabanRepository,
    @Inject(IPertanyaanRepository)
    private readonly pertanyaanRepo: IPertanyaanRepository,
    private readonly logger: LoggerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    data: CreateJawabanDTO[],
    user: UserRequest,
  ): Promise<CreateJawabanResponseDTO[]> {
    try {
      const { evaluateeId, indikatorId } = data[0];
      const isConsistent = data.every(
        (item) =>
          item.evaluateeId === evaluateeId && item.indikatorId === indikatorId,
      );
      if (!isConsistent)
        throw new BadRequestException(
          `Semua jawaban harus memiliki evaluateeId dan indikatorId yang sama`,
        );

      const pertanyaanIds = data.map((item) => item.pertanyaanId);

      // 1 query untuk semua pertanyaan
      const questions = await this.pertanyaanRepo.findManyByIds(pertanyaanIds);
      const questionMap = new Map(questions.map((q) => [q.id, q]));

      // Validasi semua pertanyaan exist
      for (const item of data) {
        if (!questionMap.has(item.pertanyaanId))
          throw new NotFoundException(
            `Pertanyaan dengan id ${item.pertanyaanId} tidak ditemukan`,
          );
      }

      const pairs = data.map((item) => ({
        pertanyaanId: item.pertanyaanId,
        evaluateeId: item.evaluateeId,
      }));
      const existingAnswers = await this.jawabanRepo.findManyUnique(
        pairs,
        user.id,
      );

      // Buat set dari kombinasi yang sudah ada
      const existingSet = new Set(
        existingAnswers.map((a) => `${a.pertanyaanId}_${a.evaluateeId}`),
      );

      // Filter hanya yang belum ada
      const newData = data.filter(
        (item) => !existingSet.has(`${item.pertanyaanId}_${item.evaluateeId}`),
      );

      if (newData.length === 0)
        throw new BadRequestException(`Semua jawaban sudah ada`);

      const payloads: InternalCreateJawabanDTO[] = newData.map((item) => ({
        indikatorId: item.indikatorId,
        pertanyaanId: item.pertanyaanId,
        evaluatorId: user.id,
        evaluateeId: item.evaluateeId,
        notes: item.notes ?? undefined,
        nilai: item.nilai * questionMap.get(item.pertanyaanId)!.bobot,
      }));

      const jawaban = await this.jawabanRepo.createMany(payloads);
      this.eventEmitter.emit(
        'jawaban.submitted',
        new JawabanSubmitEvent(indikatorId, evaluateeId),
      );
      return jawaban;
    } catch (err) {
      this.logger.error(err, 'CreateJawabanUseCase');
      throw err;
    }
  }
}
