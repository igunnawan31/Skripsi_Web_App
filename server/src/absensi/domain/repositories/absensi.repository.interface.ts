import { CreateAbsensiDTO } from "src/absensi/application/dtos/request/create-absensi.dto";
import { CreateAbsensiResponseDTO } from "src/absensi/application/dtos/response/create-response.dto";
import { RetrieveAbsensiResponseDTO, RetrieveAllAbsensiResponseDTO } from "src/absensi/application/dtos/response/read-response.dto";
import { UpdateCutiDTO } from "src/cuti/application/dtos/request/update-cuti.dto";
import { UpdateCutiResponseDTO } from "src/cuti/application/dtos/response/update-response.dto";

export abstract class IAbsensiRepository {
  abstract findByUserAndDate(userId: string, date: Date): Promise<RetrieveAbsensiResponseDTO>;
  abstract findByUserId(userId: string, startDate: Date, endDate: Date): Promise<RetrieveAllAbsensiResponseDTO>;
  abstract findByMonth(userId: string, year: number, month: number): Promise<RetrieveAllAbsensiResponseDTO>;
  abstract countAbsensiInMonth(userId: string, year: number, month: number): Promise<number>;
  abstract create(data: CreateAbsensiDTO): Promise<CreateAbsensiResponseDTO>;
  abstract update(userId: string, date: Date, data: UpdateCutiDTO): Promise<UpdateCutiResponseDTO>;
  abstract checkOut(userId: string, date: Date): Promise<UpdateCutiResponseDTO>;
}
