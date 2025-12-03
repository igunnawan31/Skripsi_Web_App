import { UserRequest } from "src/common/types/UserRequest.dto";
import { CreateCutiDTO } from "src/cuti/application/dtos/request/create-cuti.dto";
import { CutiFilterDTO } from "src/cuti/application/dtos/request/filter-cuti.dto";
import { UpdateCutiDTO } from "src/cuti/application/dtos/request/update-cuti.dto";
import { CreateCutiResponseDTO } from "src/cuti/application/dtos/response/create-response.dto";
import { RetrieveAllCutiResponseDTO, RetrieveCutiResponseDTO } from "src/cuti/application/dtos/response/read-response.dto";
import { UpdateCutiResponseDTO } from "src/cuti/application/dtos/response/update-response.dto";

export abstract class ICutiRepository {
  abstract findById(id: string): Promise<RetrieveCutiResponseDTO>;
  abstract findByUserId(userId: string, filters: CutiFilterDTO): Promise<RetrieveAllCutiResponseDTO>;
  abstract findPendingForApprover(user: UserRequest, filters: CutiFilterDTO): Promise<RetrieveAllCutiResponseDTO>;
  abstract checkOverlap(userId: string, startDate: Date, endDate: Date): Promise<boolean>;
  // abstract countUsedCuti(userId: string, year: number, month: number): Promise<number>;
  abstract countUsedCutiDays(userId: string, year: number, month: number): Promise<number>;
  abstract findByMonth(userId: string, year: number, month: number, filters: CutiFilterDTO): Promise<RetrieveAllCutiResponseDTO>;
  abstract create(data: CreateCutiDTO /*, approverId: string */): Promise<CreateCutiResponseDTO>;
  abstract update(id: string, data: UpdateCutiDTO): Promise<UpdateCutiResponseDTO>;
  abstract cutiApproval(id: string, data: UpdateCutiDTO, approverId?: string): Promise<UpdateCutiResponseDTO>;
  abstract remove(id: string): Promise<UpdateCutiDTO>;
}
