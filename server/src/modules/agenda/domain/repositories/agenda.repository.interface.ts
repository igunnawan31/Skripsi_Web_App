import { UserRequest } from 'src/common/types/UserRequest.dto';
import { InternalAgendaFilterDTO } from '../../application/dtos/request/filter.dto';
import {
  RetrieveAgendaOccurrencesResponseDTO,
  RetrieveAgendaResponseDTO,
  RetrieveAllAgendaResponseDTO,
} from '../../application/dtos/response/read.dto';
import { InternalCreateAgendaDTO } from '../../application/dtos/request/create.dto';
import {
  CreateAgendaResponseDTO,
  CreateOccurrenceResponseDTO,
} from '../../application/dtos/response/create.dto';
import {
  InternalUpdateAgendaDTO,
  InternalUpdateAgendaOccurrenceDTO,
} from '../../application/dtos/request/update.dto';
import {
  UpdateAgendaOccurrenceResponseDTO,
  UpdateAgendaResponseDTO,
} from '../../application/dtos/response/update.dto';

export abstract class IAgendaRepository {
  abstract findAll(
    filters: InternalAgendaFilterDTO,
    user: UserRequest,
  ): Promise<RetrieveAllAgendaResponseDTO | null>;
  abstract findById(id: string): Promise<RetrieveAgendaResponseDTO | null>;
  abstract findOccurenceById(
    id: string,
  ): Promise<RetrieveAgendaOccurrencesResponseDTO | null>;
  abstract findAllOccurrences(
    year: number,
    month: number,
  ): Promise<RetrieveAgendaOccurrencesResponseDTO[] | null>;
  abstract create(
    dto: InternalCreateAgendaDTO,
    occurrences: Date[],
  ): Promise<CreateAgendaResponseDTO>;
  abstract update(
    id: string,
    dto: InternalUpdateAgendaDTO,
  ): Promise<UpdateAgendaResponseDTO>;
  abstract updateOccurrence(
    id: string,
    dto: InternalUpdateAgendaOccurrenceDTO,
  ): Promise<UpdateAgendaOccurrenceResponseDTO>;
  abstract updateWithOccurrences(
    id: string,
    data: InternalUpdateAgendaDTO,
    occurrences: Date[],
  ): Promise<UpdateAgendaResponseDTO>;
  abstract removeOccurrence(id: string): Promise<void>;
  abstract remove(id: string): Promise<void>;
}
