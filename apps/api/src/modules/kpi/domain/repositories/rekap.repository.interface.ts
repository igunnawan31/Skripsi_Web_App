import { CreateIndikatorRekapDTO } from "../../application/dtos/request/rekap/create-rekap.dto";
import { InternalRekapFilterDTO } from "../../application/dtos/request/rekap/filter-rekap.dto";
import { UpdateIndikatorRekapDTO } from "../../application/dtos/request/rekap/update-rekap.dto";
import { CreateIndikatorRekapResponseDTO } from "../../application/dtos/response/rekap/create-response.dto";
import { RetrieveAllIndikatorRekapResponseDTO, RetrieveIndikatorRekapResponseDTO } from "../../application/dtos/response/rekap/read-response.dto";
import { UpdateIndikatorRekapResponseDTO } from "../../application/dtos/response/rekap/update-response.dto";

export abstract class IRekapRepository {
  abstract findAll(filters: InternalRekapFilterDTO): Promise<RetrieveAllIndikatorRekapResponseDTO | null>
  abstract findUnique(
    indikatorId: string, evaluateeId: string,
  ): Promise<RetrieveIndikatorRekapResponseDTO | null>;
  abstract create(data: CreateIndikatorRekapDTO): Promise<CreateIndikatorRekapResponseDTO>;
  abstract update(id: string, data: UpdateIndikatorRekapDTO): Promise<UpdateIndikatorRekapResponseDTO>
}
