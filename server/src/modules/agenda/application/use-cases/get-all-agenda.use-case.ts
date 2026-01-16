import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IAgendaRepository } from "../../domain/repositories/agenda.repository.interface";
import { LoggerService } from "src/modules/logger/logger.service";
import { AgendaFilterDTO, InternalAgendaFilterDTO } from "../dtos/request/filter.dto";
import { UserRequest } from "src/common/types/UserRequest.dto";
import { RetrieveAllAgendaResponseDTO } from "../dtos/response/read.dto";

@Injectable()
export class GetAllAgendaUseCase {
  constructor(
    @Inject(IAgendaRepository)
    private readonly agendaRepo: IAgendaRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(
    filters: AgendaFilterDTO,
    user: UserRequest,
  ): Promise<RetrieveAllAgendaResponseDTO> {
    this.logger.log(
      `${user.email} requests get all agenda`,
    );
    const payload: InternalAgendaFilterDTO = {
      ...filters,
      minEventDate: filters.minEventDate ? new Date(filters.minEventDate) : undefined,
      maxEventDate: filters.maxEventDate ? new Date(filters.maxEventDate) : undefined,
    }
    const agendas = await this.agendaRepo.findAll(payload, user);
    if (!agendas)
      throw new NotFoundException('Data agenda tidak ditemukan');

    return agendas;
  }
}
