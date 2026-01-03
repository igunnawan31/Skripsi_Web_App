import { FileMetaData } from "src/common/types/FileMetaData.dto";
import { UserRequest } from "src/common/types/UserRequest.dto";
import { RetrieveAllCutiResponseDTO, RetrieveCutiResponseDTO } from "../../application/dtos/response/read-response.dto";
import { CutiFilterDTO } from "../../application/dtos/request/filter-cuti.dto";
import { CreateCutiResponseDTO } from "../../application/dtos/response/create-response.dto";
import { UpdateCutiResponseDTO } from "../../application/dtos/response/update-response.dto";
import { UpdateCutiDTO } from "../../application/dtos/request/update-cuti.dto";
import { InternalCreateCutiDTO } from "../../application/dtos/request/create-cuti.dto";
import { ApprovalCutiDTO } from "../../application/dtos/request/approval.dto";
export abstract class ICutiRepository {
  abstract checkOverlap(userId: string, startDate: Date, endDate: Date): Promise<boolean>;
  abstract countUsedCutiDays(userId: string, year: number, month: number): Promise<number>;
  abstract findExpired(today: Date);
  abstract findById(id: string): Promise<RetrieveCutiResponseDTO>;
  abstract findByUserId(userId: string, filters: CutiFilterDTO): Promise<RetrieveAllCutiResponseDTO>;
  abstract findPendingForApprover(user: UserRequest, filters: CutiFilterDTO): Promise<RetrieveAllCutiResponseDTO>;
  abstract findAll(user: UserRequest, filters: CutiFilterDTO): Promise<RetrieveAllCutiResponseDTO>;
  abstract findTeamCuti(user: UserRequest, filters: CutiFilterDTO): Promise<RetrieveAllCutiResponseDTO>;
  abstract findByMonth(userId: string, year: number, month: number, filters: CutiFilterDTO): Promise<RetrieveAllCutiResponseDTO>;
  abstract create(data: InternalCreateCutiDTO /*, approverId: string */): Promise<CreateCutiResponseDTO>;
  abstract update(id: string, data: UpdateCutiDTO, file: FileMetaData): Promise<UpdateCutiResponseDTO>;
  abstract expirePendingCutiBefore(endDate: Date): Promise<number>;
  abstract cutiApproval(id: string, data: ApprovalCutiDTO, approverId?: string): Promise<UpdateCutiResponseDTO>;
  abstract remove(id: string): Promise<UpdateCutiDTO>;
}
