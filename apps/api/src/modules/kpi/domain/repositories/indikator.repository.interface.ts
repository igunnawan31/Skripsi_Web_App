import { InternalIndikatorFilterDTO } from '../../application/dtos/request/indikator/filter-indicator.dto';
import {
  RetrieveAllIndikatorResponseDTO,
  RetrieveIndikatorResponseDTO,
} from '../../application/dtos/response/indikator/read-response.dto';
import {
  InternalCreateEvaluationsDTO,
  InternalCreateIndikatorDTO,
} from '../../application/dtos/request/indikator/create-indicator.dto';
import { CreateIndikatorResponseDTO } from '../../application/dtos/response/indikator/create-response.dto';
import { InternalUpdateIndikatorDTO } from '../../application/dtos/request/indikator/update-indicator.dto';
import { UpdateIndikatorResponseDTO } from '../../application/dtos/response/indikator/update-response.dto';
import { EvaluationKPIDTO } from '../../application/dtos/indikatorKPI.dto';

export abstract class IIndikatorRepository {
  abstract findAll(
    filters: InternalIndikatorFilterDTO,
  ): Promise<RetrieveAllIndikatorResponseDTO | null>;
  abstract findById(id: string): Promise<RetrieveIndikatorResponseDTO | null>;
  abstract findUniqueEval(indikatorId: string, evaluateeId: string, evaluatorId: string): Promise< EvaluationKPIDTO | null>
  abstract countEvals(
    indikatorId: string,
    evaluateeId: string,
  ): Promise<number>;
  abstract create(
    data: InternalCreateIndikatorDTO,
  ): Promise<CreateIndikatorResponseDTO>;
  abstract createWithEval(
    indikator: InternalCreateIndikatorDTO,
    evaluations: InternalCreateEvaluationsDTO[],
  ): Promise<CreateIndikatorResponseDTO>;
  abstract update(
    id: string,
    data: InternalUpdateIndikatorDTO,
  ): Promise<UpdateIndikatorResponseDTO>;
  abstract createEval(data: InternalCreateEvaluationsDTO[]): Promise<void>;
  abstract remove(id: string): Promise<void>;
  abstract removeEval(
    indikatorId: string,
    evaluateeId: string,
    evaluatorId: string,
  ): Promise<void>;
}
