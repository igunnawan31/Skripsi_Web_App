import { InternalJawabanFilterDTO } from '../../application/dtos/request/jawaban/filter-answer.dto';
import {
  RetrieveAllJawabanResponseDTO,
  RetrieveJawabanResponseDTO,
} from '../../application/dtos/response/jawaban/read-response.dto';
import { InternalCreateJawabanDTO } from '../../application/dtos/request/jawaban/create-answer.dto';
import { CreateJawabanResponseDTO } from '../../application/dtos/response/jawaban/create-response.dto';

export abstract class IJawabanRepository {
  abstract findAll(
    filters: InternalJawabanFilterDTO,
  ): Promise<RetrieveAllJawabanResponseDTO | null>;
  abstract findById(id: string): Promise<RetrieveJawabanResponseDTO | null>;
  abstract findUnique(
    pertanyaanId: string,
    evaluatorId: string,
    evaluateeId: string,
  ): Promise<RetrieveJawabanResponseDTO | null>;
  abstract findManyUnique(
    pairs: { pertanyaanId: string; evaluateeId: string }[],
    evaluatorId: string,
  ): Promise<RetrieveJawabanResponseDTO[]>;
  abstract getAllByIndicatorIdAndEvaluateeId(
    indikatorId: string,
    evaluateeId: string,
  ): Promise<RetrieveJawabanResponseDTO[] | null>;
  abstract create(data: InternalCreateJawabanDTO): Promise<CreateJawabanResponseDTO>;
  abstract createMany(
    data: InternalCreateJawabanDTO[],
  ): Promise<CreateJawabanResponseDTO[]>;

  abstract remove(id: string): Promise<void>;
}
