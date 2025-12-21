import { AbsensiFilterDTO } from 'src/absensi/application/dtos/request/absensi-filter.dto';
import { CheckInDTO, InternalCheckInDTO } from 'src/absensi/application/dtos/request/check-in.dto';
import { InternalCheckOutDTO } from 'src/absensi/application/dtos/request/check-out.dto';
import { CheckInResponseDTO } from 'src/absensi/application/dtos/response/create-response.dto';
import {
  RetrieveAbsensiResponseDTO,
  RetrieveAllAbsensiResponseDTO,
} from 'src/absensi/application/dtos/response/read-response.dto';
import { CheckOutResponseDTO } from 'src/absensi/application/dtos/response/update-response.dto';

export abstract class IAbsensiRepository {
  abstract findByUserAndDate(
    userId: string,
    date: Date,
  ): Promise<RetrieveAbsensiResponseDTO>;
  abstract findByUserId(
    userId: string,
    startDate: Date,
    endDate: Date,
    filters: AbsensiFilterDTO,
  ): Promise<RetrieveAllAbsensiResponseDTO>;
  abstract findByMonth(
    userId: string,
    year: number,
    month: number,
    filters: AbsensiFilterDTO,
  ): Promise<RetrieveAllAbsensiResponseDTO>;
  abstract countAbsensiInMonth(
    userId: string,
    year: number,
    month: number,
  ): Promise<number>;
  abstract checkIn(
    data: Omit<InternalCheckInDTO, 'date' | 'checkIn'> & { date: Date; checkIn: Date },
  ): Promise<CheckInResponseDTO>;
  abstract checkOut(data: InternalCheckOutDTO): Promise<CheckOutResponseDTO>;
  abstract findAllOneDay(filters: AbsensiFilterDTO): Promise<RetrieveAllAbsensiResponseDTO>;
}
