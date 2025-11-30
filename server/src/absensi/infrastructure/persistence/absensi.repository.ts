import { CreateAbsensiDTO } from 'src/absensi/application/dtos/request/create-absensi.dto';
import { CreateAbsensiResponseDTO } from 'src/absensi/application/dtos/response/create-response.dto';
import {
  RetrieveAbsensiResponseDTO,
  RetrieveAllAbsensiResponseDTO,
} from 'src/absensi/application/dtos/response/read-response.dto';
import { IAbsensiRepository } from 'src/absensi/domain/repositories/absensi.repository.interface';
import { handlePrismaError } from 'src/common/errors/prisma-exception';
import { UpdateCutiResponseDTO } from 'src/cuti/application/dtos/response/update-response.dto';

export class AbsensiRepository implements IAbsensiRepository {
  async findByUserAndDate(
    userId: string,
    date: Date,
  ): Promise<RetrieveAbsensiResponseDTO> {
    try {
    } catch (err) {
      handlePrismaError(err, 'Absensi');
    }
  }
  async findByUserId(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<RetrieveAllAbsensiResponseDTO> {
    try {
    } catch (err) {
      handlePrismaError(err, 'Absensi');
    }
  }

  async findByMonth(
    userId: string,
    year: number,
    month: number,
  ): Promise<RetrieveAllAbsensiResponseDTO> {
    try {
    } catch (err) {
      handlePrismaError(err, 'Absensi');
    }
  }

  async countAbsensiInMonth(
    userId: string,
    year: number,
    month: number,
  ): Promise<number> {
    try {
    } catch (err) {
      handlePrismaError(err, 'Absensi');
    }
  }

  async create(data: CreateAbsensiDTO): Promise<CreateAbsensiResponseDTO> {
    try {
    } catch (err) {
      handlePrismaError(err, 'Absensi');
    }
  }

  async update(
    userId: string,
    date: Date,
    data: UpdateCutiDTO,
  ): Promise<UpdateCutiResponseDTO> {
    try {
    } catch (err) {
      handlePrismaError(err, 'Absensi');
    }
  }

  async checkOut(userId: string, date: Date): Promise<UpdateCutiResponseDTO> {
    try {
    } catch (err) {
      handlePrismaError(err, 'Absensi');
    }
  }
}
