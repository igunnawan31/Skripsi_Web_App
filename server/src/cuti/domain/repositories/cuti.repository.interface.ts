import { FileMetaData } from "src/common/types/FileMetaData.dto";
import { UserRequest } from "src/common/types/UserRequest.dto";
import { ApprovalCutiDTO } from "src/cuti/application/dtos/request/approval.dto";
import { CreateCutiDTO, InternalCreateCutiDTO } from "src/cuti/application/dtos/request/create-cuti.dto";
import { CutiFilterDTO } from "src/cuti/application/dtos/request/filter-cuti.dto";
import { UpdateCutiDTO } from "src/cuti/application/dtos/request/update-cuti.dto";
import { CreateCutiResponseDTO } from "src/cuti/application/dtos/response/create-response.dto";
import { RetrieveAllCutiResponseDTO, RetrieveCutiResponseDTO } from "src/cuti/application/dtos/response/read-response.dto";
import { UpdateCutiResponseDTO } from "src/cuti/application/dtos/response/update-response.dto";

export abstract class ICutiRepository {
  // Internal
  abstract checkOverlap(userId: string, startDate: Date, endDate: Date): Promise<boolean>;
  abstract countUsedCutiDays(userId: string, year: number, month: number): Promise<number>;
  abstract findExpired(today: Date);
  
  // External
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
