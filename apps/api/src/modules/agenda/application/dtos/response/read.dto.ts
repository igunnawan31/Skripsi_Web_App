import { Expose } from 'class-transformer';
import { AgendaBaseDTO, AgendaOccurrencesBaseDTO } from "../base.dto";
import { ProjectBaseDTO } from "src/modules/project/application/dtos/base.dto";
import { meta } from 'src/common/types/QueryMeta.dto';

export class RetrieveAgendaResponseDTO extends AgendaBaseDTO {
  @Expose()
  project: ProjectBaseDTO;

  @Expose()
  occurrences: AgendaOccurrencesBaseDTO[];
}

export class RetrieveAllAgendaResponseDTO {
  @Expose()
  data: RetrieveAgendaResponseDTO[];

  @Expose()
  meta: meta;
}

export class RetrieveAgendaOccurrencesResponseDTO extends AgendaOccurrencesBaseDTO {
  
}
