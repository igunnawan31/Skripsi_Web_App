import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UserRequest } from "src/common/types/UserRequest.dto";
import { IJawabanRepository } from "src/modules/kpi/domain/repositories/jawaban.repository.interface";
import { RetrieveRekapDTO } from "../../dtos/response/rekap/read-response.dto";
import { IIndikatorRepository } from "src/modules/kpi/domain/repositories/indikator.repository.interface";
import { IUserRepository } from "src/modules/users/domain/repositories/users.repository.interface";
import { plainToInstance } from "class-transformer";
import { UserBaseDTO } from "src/modules/users/application/dtos/base.dto";
import { IndikatorKPIBaseDTO } from "../../dtos/indikatorKPI.dto";

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

    const userData = await this.userRepo.findById(userId);

    if (!userData) throw new NotFoundException(`Data user tidak ditemukan`)

    let totalNilai: number = 0;
    let rataRata: number;
    const jumlahPenilai: number = await this.indikatorRepo.countEvals(indikatorId, userId);

    answers.forEach(answer => {
      totalNilai += answer.nilai;
    });

    rataRata = totalNilai / answers.length

    const result: RetrieveRekapDTO = {
      indikatorId: indikatorId,
      userId: userId,
      totalNilai,
      rataRata,
      jumlahPenilai,
      indikator: plainToInstance(IndikatorKPIBaseDTO, indikator), 
      user: plainToInstance(UserBaseDTO, userData), 
    }

    return result;
  }
}
