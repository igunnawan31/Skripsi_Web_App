import { Expose } from "class-transformer";
import { EvaluationKPIDTO, IndikatorKPIBaseDTO } from "../../indikatorKPI.dto";

export class CreateIndikatorResponseDTO extends IndikatorKPIBaseDTO {
  @Expose()
  evaluations: CreateEvaluationsResponseDTO[];
}

export class CreateEvaluationsResponseDTO extends EvaluationKPIDTO {

}
