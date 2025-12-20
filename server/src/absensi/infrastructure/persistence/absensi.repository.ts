import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { AbsensiFilterDTO } from 'src/absensi/application/dtos/request/absensi-filter.dto';
import { CheckInDTO } from 'src/absensi/application/dtos/request/check-in.dto';
import { CheckInResponseDTO } from 'src/absensi/application/dtos/response/create-response.dto';
import {
  RetrieveAbsensiResponseDTO,
  RetrieveAllAbsensiResponseDTO,
} from 'src/absensi/application/dtos/response/read-response.dto';
import { CheckOutResponseDTO } from 'src/absensi/application/dtos/response/update-response.dto';
import { IAbsensiRepository } from 'src/absensi/domain/repositories/absensi.repository.interface';
import { handlePrismaError } from 'src/common/errors/prisma-exception';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { UserBaseDTO } from 'src/users/application/dtos/base.dto';

@Injectable()
export class AbsensiRepository implements IAbsensiRepository {
  constructor(private readonly prisma: PrismaService) { }
  async findByUserAndDate(
    userId: string,
    date: Date,
  ): Promise<RetrieveAbsensiResponseDTO> {
    try {
      const absensi = this.prisma.absensi.findUnique({
        where: { userId_date: { userId, date } },
        include: { user: true },
      });
      if (!absensi) throw new NotFoundException('Absensi data not found');
      return plainToInstance(RetrieveAbsensiResponseDTO, absensi);
    } catch (err) {
      handlePrismaError(err, 'Absensi');
    }
  }
  async findByUserId(
    userId: string,
    startDate: Date,
    endDate: Date,
    filters: AbsensiFilterDTO,
  ): Promise<RetrieveAllAbsensiResponseDTO> {
    const {
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;
    try {
      const where: Prisma.AbsensiWhereInput = {
        userId,
        workStatus: status ?? undefined,
        checkIn: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      };
      const orderBy: Prisma.AbsensiOrderByWithRelationInput = {};
      if (sortBy && ['createdAt'].includes(sortBy)) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.createdAt = 'desc';
      }
      const [absensis, total] = await this.prisma.$transaction([
        this.prisma.absensi.findMany({
          where,
          orderBy,
          skip: (page - 1) * limit,
          take: limit,
          include: { user: true },
        }),
        this.prisma.absensi.count({ where }),
      ]);
      return plainToInstance(RetrieveAllAbsensiResponseDTO, {
        data: absensis.map((a) =>
          plainToInstance(RetrieveAbsensiResponseDTO, {
            ...a,
            user: plainToInstance(UserBaseDTO, a.user),
          }),
        ),
        meta: {
          page,
          total,
          limit,
          totalPage: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      handlePrismaError(err, 'Absensi');
    }
  }

  async findByMonth(
    userId: string,
    year: number,
    month: number,
    filters: AbsensiFilterDTO,
  ): Promise<RetrieveAllAbsensiResponseDTO> {
    const {
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;
    try {
      const where: Prisma.AbsensiWhereInput = {
        userId,
        workStatus: status ?? undefined,
        checkIn: {
          gte: new Date(year, month, 1),
          lt: new Date(year, month + 1, 1),
        },
      };
      const orderBy: Prisma.AbsensiOrderByWithRelationInput = {};
      if (sortBy && ['createdAt'].includes(sortBy)) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.createdAt = 'desc';
      }
      const [absensis, total] = await this.prisma.$transaction([
        this.prisma.absensi.findMany({
          where,
          orderBy,
          skip: (page - 1) * limit,
          take: limit,
          include: { user: true },
        }),
        this.prisma.absensi.count({ where }),
      ]);
      return plainToInstance(RetrieveAllAbsensiResponseDTO, {
        data: absensis.map((a) =>
          plainToInstance(RetrieveAbsensiResponseDTO, {
            ...a,
            user: plainToInstance(UserBaseDTO, a.user),
          }),
        ),
        meta: {
          page,
          total,
          limit,
          totalPage: Math.ceil(total / limit),
        },
      });
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
      const query = await this.prisma.absensi.count({
        where: {
          userId,
          checkOut: {
            gte: new Date(year, month, 1),
            lt: new Date(year, month + 1, 1),
          },
        },
      });
      return query;
    } catch (err) {
      handlePrismaError(err, 'Absensi');
    }
  }

  async checkIn(
    data: Omit<CheckInDTO, 'date' | 'checkIn'> & { date: Date; checkIn: Date },
  ): Promise<CheckInResponseDTO> {
    try {
      const query = await this.prisma.absensi.create({
        data: { ...data },
      });
      return plainToInstance(CheckInResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Absensi');
    }
  }

  async checkOut(userId: string, date: Date): Promise<CheckOutResponseDTO> {
    try {
      const query = await this.prisma.absensi.update({
        where: { userId_date: { userId, date } },
        data: {
          checkOut: new Date(),
        },
      });
      return plainToInstance(CheckOutResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Absensi');
    }
  }
}
