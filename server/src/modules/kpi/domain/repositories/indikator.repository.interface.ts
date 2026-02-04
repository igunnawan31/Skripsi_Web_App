import { UserRequest } from "src/common/types/UserRequest.dto";
import { IndikatorFilterDTO } from "../../application/dtos/request/indikator/filter-indicator.dto";
import { RetrieveAllIndikatorResponseDTO } from "../../application/dtos/response/indikator/read-response.dto";
import { InternalCreateIndikatorDTO } from "../../application/dtos/request/indikator/create-indicator.dto";
import { CreateIndikatorResponseDTO } from "../../application/dtos/response/indikator/create-response.dto";
import { UpdateIndikatorDTO } from "../../application/dtos/request/indikator/update-indicator.dto";
import { UpdateIndikatorResponseDTO } from "../../application/dtos/response/indikator/update-response.dto";

export abstract class IIndikatorRepository {
  abstract findAll(filters: IndikatorFilterDTO, user: UserRequest): Promise<RetrieveAllIndikatorResponseDTO | null>;
  abstract findById(id: string): Promise<RetrieveAllIndikatorResponseDTO | null>;
  abstract create(data: InternalCreateIndikatorDTO): Promise<CreateIndikatorResponseDTO>;
  abstract update(id: string, data: UpdateIndikatorDTO): Promise<UpdateIndikatorResponseDTO>;
  abstract remove(id: string): Promise<void>;
}
