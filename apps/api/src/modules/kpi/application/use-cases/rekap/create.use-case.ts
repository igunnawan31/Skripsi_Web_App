import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IJawabanRepository } from 'src/modules/kpi/domain/repositories/jawaban.repository.interface';
import { IIndikatorRepository } from 'src/modules/kpi/domain/repositories/indikator.repository.interface';
import { IUserRepository } from 'src/modules/users/domain/repositories/users.repository.interface';
import { CreateIndikatorRekapDTO } from '../../dtos/request/rekap/create-rekap.dto';
import { IRekapRepository } from 'src/modules/kpi/domain/repositories/rekap.repository.interface';
import { CreateIndikatorRekapResponseDTO } from '../../dtos/response/rekap/create-response.dto';
import { IPertanyaanRepository } from 'src/modules/kpi/domain/repositories/pertanyaan.repository.interface';
import { RetrievePertanyaanResponseDTO } from '../../dtos/response/pertanyaan/read-response.dto';

@Injectable()
export class CreateIndikatorRecapUseCase {
  constructor(
    @Inject(IJawabanRepository)
    private readonly jawabanRepo: IJawabanRepository,
    @Inject(IPertanyaanRepository)
    private readonly pertanyaanRepo: IPertanyaanRepository,
    @Inject(IIndikatorRepository)
    private readonly indikatorRepo: IIndikatorRepository,
    @Inject(IUserRepository)
    private readonly userRepo: IUserRepository,
    @Inject(IRekapRepository)
    private readonly rekapRepo: IRekapRepository,
  ) {}

  async execute(
    indikatorId: string,
    evaluateeId: string,
  ): Promise<CreateIndikatorRekapResponseDTO> {
    const answers = await this.jawabanRepo.getAllByIndicatorIdAndEvaluateeId(
      indikatorId,
      evaluateeId,
    );
    const questions = await this.pertanyaanRepo.findQuestions(indikatorId);

    if (!questions)
      throw new NotFoundException(
        `Data pertanyaan tidak ditemukan untuk indikator dan user tersebut`,
      );

    if (!answers)
      throw new NotFoundException(
        `Data jawaban tidak ditemukan untuk indikator dan user tersebut`,
      );

    const indikator = await this.indikatorRepo.findById(indikatorId);
    if (!indikator)
      throw new NotFoundException(`Data indikator tidak ditemukan`);

    const userData = await this.userRepo.findById(evaluateeId);
    if (!userData) throw new NotFoundException(`Data user tidak ditemukan`);

    // Map questions by id for O(1) lookup
    const questionMap = new Map<string, RetrievePertanyaanResponseDTO>(
      questions.map((q) => [q.id, q]),
    );

    const jumlahPenilai: number = await this.indikatorRepo.countEvals(
      indikatorId,
      evaluateeId,
    );

    // Step 1: group answers by pertanyaanId
    const answersByQuestion = new Map<string, number[]>();
    answers.forEach((answer) => {
      const group = answersByQuestion.get(answer.pertanyaanId) ?? [];
      group.push(answer.nilai);
      answersByQuestion.set(answer.pertanyaanId, group);
    });

    // Step 2: weighted average across questions
    let weightedNilaiSum = 0;
    let totalBobot = 0;

    answersByQuestion.forEach((nilaiList, pertanyaanId) => {
      const question = questionMap.get(pertanyaanId);
      if (!question) return;

      const avgNilai =
        nilaiList.reduce((sum, n) => sum + n, 0) / nilaiList.length; // avg across evaluators
      weightedNilaiSum += avgNilai * question.bobot; // weighted by bobot
      totalBobot += question.bobot; // count bobot
    });

    const totalNilai = totalBobot > 0 ? weightedNilaiSum / totalBobot : 0;
    const rataRata = totalNilai;

    const payload: CreateIndikatorRekapDTO = {
      indikatorId,
      userId: evaluateeId,
      totalNilai,
      rataRata,
      jumlahPenilai,
    };

    const existing = await this.rekapRepo.findUnique(indikatorId, evaluateeId);
    if (!existing) {
      return await this.rekapRepo.create(payload);
    } else {
      return await this.rekapRepo.update(existing.id, payload);
    }
  }
}
