import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IJawabanRepository } from 'src/modules/kpi/domain/repositories/jawaban.repository.interface';
import { IIndikatorRepository } from 'src/modules/kpi/domain/repositories/indikator.repository.interface';
import { IUserRepository } from 'src/modules/users/domain/repositories/users.repository.interface';
import { CreateIndikatorRekapDTO } from '../../dtos/request/rekap/create-rekap.dto';
import { IRekapRepository } from 'src/modules/kpi/domain/repositories/rekap.repository.interface';
import { CreateIndikatorRekapResponseDTO } from '../../dtos/response/rekap/create-response.dto';

@Injectable()
export class CreateIndikatorRecapUseCase {
  constructor(
    @Inject(IJawabanRepository)
    private readonly jawabanRepo: IJawabanRepository,
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

    if (!answers)
      throw new NotFoundException(
        `Data jawaban tidak ditemukan untuk indikator dan user tersebut`,
      );

    const indikator = await this.indikatorRepo.findById(indikatorId);

    if (!indikator)
      throw new NotFoundException(`Data indikator tidak ditemukan`);

    const userData = await this.userRepo.findById(evaluateeId);

    if (!userData) throw new NotFoundException(`Data user tidak ditemukan`);

    let totalNilai: number = 0;
    let rataRata: number;
    const jumlahPenilai: number = await this.indikatorRepo.countEvals(
      indikatorId,
      evaluateeId,
    );

    console.log(answers);
    answers.forEach((answer, index) => {
      console.log('totalNilai: ', index, answer.nilai);
      totalNilai += answer.nilai;
    });

    console.log('jumlahPenilai: ', jumlahPenilai);
    rataRata = jumlahPenilai > 0 ? totalNilai / jumlahPenilai : 0;

    const payload: CreateIndikatorRekapDTO = {
      indikatorId: indikatorId,
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
