import { UserRequest } from 'src/common/types/UserRequest.dto';
import { InternalJawabanFilterDTO } from '../../application/dtos/request/jawaban/filter-answer.dto';
import {
  RetrieveAllJawabanResponseDTO,
  RetrieveJawabanResponseDTO,
} from '../../application/dtos/response/jawaban/read-response.dto';
import { CreateJawabanDTO } from '../../application/dtos/request/jawaban/create-answer.dto';
import { CreateJawabanResponseDTO } from '../../application/dtos/response/jawaban/create-response.dto';

export abstract class IJawabanRepository {
  abstract findAll(
    filters: InternalJawabanFilterDTO,
  ): Promise<RetrieveAllJawabanResponseDTO | null>;
  abstract findById(id: string): Promise<RetrieveJawabanResponseDTO | null>;
  abstract findUnique(pertanyaanId: string, evaluatorId: string, evaluateeId: string): Promise<RetrieveJawabanResponseDTO | null>;
  abstract getAllByIndicatorId(id: string): Promise<RetrieveJawabanResponseDTO[] | null>;
  abstract create(data: CreateJawabanDTO): Promise<CreateJawabanResponseDTO>;
  abstract remove(id: string): Promise<void>;
}
