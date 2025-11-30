import { CreateCutiDTO } from "src/cuti/application/dtos/request/create-cuti.dto";
import { UpdateCutiDTO } from "src/cuti/application/dtos/request/update-cuti.dto";
import { CreateCutiResponseDTO } from "src/cuti/application/dtos/response/create-response.dto";
import { RetrieveAllCutiResponseDTO, RetrieveCutiResponseDTO } from "src/cuti/application/dtos/response/read-response.dto";
import { UpdateCutiResponseDTO } from "src/cuti/application/dtos/response/update-response.dto";

export abstract class ICutiRepository {
  abstract findById(id: string): Promise<RetrieveCutiResponseDTO>;
  abstract findByUserId(userId: string): Promise<RetrieveAllCutiResponseDTO>;
  abstract findPendingForApprover(approverId: string): Promise<RetrieveAllCutiResponseDTO>;
  abstract checkOverlap(userId: string, startDate: Date, endDate: Date): Promise<boolean>;
  abstract countUsedCuti(userId: string, year: number, month: number): Promise<number>;
  abstract countUsedCutiDays(userId: string, year: number, month: number): Promise<number>;
  abstract findByMonth(userId: string, year: number, month: number): Promise<RetrieveAllCutiResponseDTO>;
  abstract create(data: CreateCutiDTO): Promise<CreateCutiResponseDTO>;
  abstract update(id: string, data: UpdateCutiDTO): Promise<UpdateCutiResponseDTO>;
  abstract cancel(id: string): Promise<UpdateCutiDTO>;
}
