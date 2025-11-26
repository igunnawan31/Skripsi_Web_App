import { CreateKontrakDTO } from "src/kontrak/application/dtos/request/create-kontrak.dto";
import { KontrakFilterDTO } from "src/kontrak/application/dtos/request/kontrak-filter.dto";
import { UpdateKontrakDTO } from "src/kontrak/application/dtos/request/update-kontrak.dto";
import { CreateKontrakResponseDTO } from "src/kontrak/application/dtos/response/create-response.dto";
import { DeleteKontrakResponseDTO } from "src/kontrak/application/dtos/response/delete-response.dto";
import { RetrieveAllKontrakResponseDTO, RetrieveKontrakResponseDTO } from "src/kontrak/application/dtos/response/read-response.dto";
import { UpdateKontrakResponseDTO } from "src/kontrak/application/dtos/response/update-response.dto";

export abstract class IKontrakRepository {
  abstract findAll(filters: KontrakFilterDTO): Promise<RetrieveAllKontrakResponseDTO>;
  abstract findById(id: string): Promise<RetrieveKontrakResponseDTO>;
  abstract findByUserId(userId: string, filters: KontrakFilterDTO): Promise<RetrieveAllKontrakResponseDTO>;
  abstract getTotalCutiQuota(userId: string): Promise<number>;
  abstract getTotalAbsensiQuota(userId: string): Promise<number>;
  abstract create(data: CreateKontrakDTO): Promise<CreateKontrakResponseDTO>;
  abstract update(id: string, data: UpdateKontrakDTO): Promise<UpdateKontrakResponseDTO>;
  abstract endContract(id: string): Promise<UpdateKontrakResponseDTO>;
  abstract remove(id: string): Promise<DeleteKontrakResponseDTO>;
}

