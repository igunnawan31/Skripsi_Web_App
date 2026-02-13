import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UserRequest } from "src/common/types/UserRequest.dto";
import { IJawabanRepository } from "src/modules/kpi/domain/repositories/jawaban.repository.interface";
import { RetrieveRekapDTO } from "../../dtos/response/rekap/read-response.dto";
import { IIndikatorRepository } from "src/modules/kpi/domain/repositories/indikator.repository.interface";
import { IUserRepository } from "src/modules/users/domain/repositories/users.repository.interface";

@Injectable()
export class CreateIndikatorRecapUseCase {
  constructor(
    @Inject(IJawabanRepository)
    private readonly jawabanRepo: IJawabanRepository,
    @Inject(IIndikatorRepository)
    private readonly indikatorRepo: IIndikatorRepository,
    @Inject(IUserRepository)
    private readonly userRepo: IUserRepository,
  ) {
  }

  async execute(indikatorId: string, userId: string, user: UserRequest): Promise<RetrieveRekapDTO> {
    const answers = await this.jawabanRepo.getAllByIndicatorId(indikatorId);

    if (!answers) throw new NotFoundException(`Data jawaban tidak ditemukan untuk indikator dan user tersebut`)

    const indikator = await this.indikatorRepo.findById(indikatorId);

    if (!indikator) throw new NotFoundException(`Data indikator tidak ditemukan`)

    const userData = await this.userRepo.findById(user.id);

    if (!userData) throw new NotFoundException(`Data user tidak ditemukan`)

    let totalNilai: number = 0;
    let rataRata: number;
    const jumlahPenilai: number = await this.indikatorRepo.countEvals(indikatorId, userId);

    answers.forEach(answer => {
      totalNilai += answer.nilai;
    });

    rataRata = totalNilai / answers.length

    const result: RetrieveRekapDTO = {
      indikatorId,
      userId,
      totalNilai,
      rataRata,
      jumlahPenilai,
      indikator, 
      user: userData, 
    }

    return result;
  }
}
