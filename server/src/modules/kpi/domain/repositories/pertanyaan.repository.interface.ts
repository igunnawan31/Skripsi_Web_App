import { UserRequest } from "src/common/types/UserRequest.dto";
import { PertanyaanFilterDTO } from "../../application/dtos/request/pertanyaan/filter-question.dto";
import { RetrieveAllPertanyaanResponseDTO, RetrievePertanyaanResponseDTO } from "../../application/dtos/response/pertanyaan/read-response.dto";
import { CreatePertanyaanDTO } from "../../application/dtos/request/pertanyaan/create-question.dto";
import { CreatePertanyaanResponseDTO } from "../../application/dtos/response/pertanyaan/create-response.dto";
import { UpdatePertanyaanResponseDTO } from "../../application/dtos/response/pertanyaan/update-response.dto";
import { UpdatePertanyaanDTO } from "../../application/dtos/request/pertanyaan/update-question.dto";

export abstract class IPertanyaanRepository {
  abstract findAll (filters: PertanyaanFilterDTO): Promise<RetrieveAllPertanyaanResponseDTO | null>;
  abstract findAllByIndicatorId (id: string, filters: PertanyaanFilterDTO): Promise<RetrieveAllPertanyaanResponseDTO | null>;
  abstract findById (id: string): Promise<RetrievePertanyaanResponseDTO | null>;
  abstract create(data: CreatePertanyaanDTO): Promise<CreatePertanyaanResponseDTO>;
  abstract update(id: string, data: UpdatePertanyaanDTO): Promise<UpdatePertanyaanResponseDTO>;
  abstract remove(id: string): Promise<void>;

}
