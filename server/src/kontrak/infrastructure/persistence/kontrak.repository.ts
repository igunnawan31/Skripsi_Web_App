import { Injectable, NotFoundException } from '@nestjs/common';
import { KontrakKerjaStatus, Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { handlePrismaError } from 'src/common/errors/prisma-exception';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { GajiBaseDTO } from 'src/gaji/application/dtos/base.dto';
import { CreateKontrakDTO } from 'src/kontrak/application/dtos/request/create-kontrak.dto';
import { KontrakFilterDTO } from 'src/kontrak/application/dtos/request/kontrak-filter.dto';
import { UpdateKontrakDTO } from 'src/kontrak/application/dtos/request/update-kontrak.dto';
import { CreateKontrakResponseDTO } from 'src/kontrak/application/dtos/response/create-response.dto';
import { DeleteKontrakResponseDTO } from 'src/kontrak/application/dtos/response/delete-response.dto';
import {
  RetrieveAllKontrakResponseDTO,
  RetrieveKontrakResponseDTO,
} from 'src/kontrak/application/dtos/response/read-response.dto';
import { UpdateKontrakResponseDTO } from 'src/kontrak/application/dtos/response/update-response.dto';
import { IKontrakRepository } from 'src/kontrak/domain/repositories/kontrak.repository.interface';
import { ProjectBaseDTO } from 'src/project/application/dtos/base.dto';
import { UserBaseDTO } from 'src/users/application/dtos/base.dto';

@Injectable()
export class KontrakRepository implements IKontrakRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateKontrakDTO): Promise<CreateKontrakResponseDTO> {
    try {
      const query = await this.prisma.kontrakKerja.create({
        data: {
          projectId: dto.projectData.id!, // validate di use case, disini selalu available. harusnya gapernah undefined
          userId: dto.userData.id!,
          ...dto,
        },
        include: {
          user: true,
          project: true,
        },
      });
      return plainToInstance(CreateKontrakResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Kontrak');
    }
  }

  async findAll(
    filters: KontrakFilterDTO,
  ): Promise<RetrieveAllKontrakResponseDTO> {
    try {
      const {
        metodePembayaran,
        status,
        minBayaran,
        minAbsensi,
        minCuti,
        maxBayaran,
        maxAbsensi,
        maxCuti,
        minStartDate,
        maxEndDate,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = filters;

      const where: Prisma.KontrakKerjaWhereInput = {
        metodePembayaran: metodePembayaran ?? undefined,
        status: status ?? undefined,
        totalBayaran: {
          gte: minBayaran ?? undefined,
          lte: maxBayaran ?? undefined,
        },
        absensiBulanan: {
          gte: minAbsensi ?? undefined,
          lte: maxAbsensi ?? undefined,
        },
        cutiBulanan: {
          gte: minCuti ?? undefined,
          lte: maxCuti ?? undefined,
        },
        startDate: {
          gte: minStartDate ? new Date(minStartDate) : undefined,
        },
        endDate: {
          lte: maxEndDate? new Date(maxEndDate) : undefined,
        },
      };

      const orderBy: Prisma.KontrakKerjaOrderByWithRelationInput = {};
      if (
        sortBy &&
        [
          'createdAt',
          'startDate',
          'endDate',
          'cutiBulanan',
          'absensiBulanan',
          'totalBayaran',
          'dpPercentage',
          'finalPercentage',
        ].includes(sortBy)
      ) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.createdAt = 'asc';
      }

      const [contracts, total] = await this.prisma.$transaction([
        this.prisma.kontrakKerja.findMany({
          where,
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
          include: {
            user: true,
            project: true,
            gaji: true,
          },
        }),
        this.prisma.kontrakKerja.count({ where }),
      ]);

      return plainToInstance(RetrieveAllKontrakResponseDTO, {
        data: contracts.map((c) =>
          plainToInstance(RetrieveKontrakResponseDTO, {
            ...c,
            user: plainToInstance(UserBaseDTO, c.user),
            project: plainToInstance(ProjectBaseDTO, c.project),
            gaji: plainToInstance(GajiBaseDTO, c.gaji),
          }),
        ),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      handlePrismaError(err, 'Kontrak');
    }
  }

  async findById(id: string): Promise<RetrieveKontrakResponseDTO> {
    try {
      const kontrak = this.prisma.kontrakKerja.findUnique({
        where: { id },
        include: {
          user: true,
          project: true,
          gaji: true,
        },
      });

      if (!kontrak) throw new NotFoundException('Kontrak data not found');
      return plainToInstance(RetrieveKontrakResponseDTO, {
        ...kontrak,
        user: plainToInstance(UserBaseDTO, kontrak.user),
        project: plainToInstance(ProjectBaseDTO, kontrak.project),
        gaji: plainToInstance(GajiBaseDTO, kontrak.gaji),
      });
    } catch (err) {
      handlePrismaError(err, 'Kontrak', id);
    }
  }

  async findByUserId(
    userId: string,
    filters: KontrakFilterDTO,
  ): Promise<RetrieveAllKontrakResponseDTO> {
    try {
      const {
        metodePembayaran,
        status,
        minBayaran,
        minAbsensi,
        minCuti,
        maxBayaran,
        maxAbsensi,
        maxCuti,
        minStartDate,
        maxEndDate,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = filters;

      const where: Prisma.KontrakKerjaWhereInput = {
        userId,
        metodePembayaran: metodePembayaran ?? undefined,
        status: status ?? undefined,
        totalBayaran: {
          gte: minBayaran ?? undefined,
          lte: maxBayaran ?? undefined,
        },
        absensiBulanan: {
          gte: minAbsensi ?? undefined,
          lte: maxAbsensi ?? undefined,
        },
        cutiBulanan: {
          gte: minCuti ?? undefined,
          lte: maxCuti ?? undefined,
        },
        startDate: {
          gte: minStartDate ? new Date(minStartDate) : undefined,
        },
        endDate: {
          lte: maxEndDate ? new Date(maxEndDate) : undefined,
        },
      };

      const orderBy: Prisma.KontrakKerjaOrderByWithRelationInput = {};
      if (
        sortBy &&
        [
          'createdAt',
          'startDate',
          'endDate',
          'cutiBulanan',
          'absensiBulanan',
          'totalBayaran',
          'dpPercentage',
          'finalPercentage',
        ].includes(sortBy)
      ) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.createdAt = 'asc';
      }

      const [contracts, total] = await this.prisma.$transaction([
        this.prisma.kontrakKerja.findMany({
          where,
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
          include: {
            user: true,
            project: true,
            gaji: true,
          },
        }),
        this.prisma.kontrakKerja.count({ where }),
      ]);

      return plainToInstance(RetrieveAllKontrakResponseDTO, {
        data: contracts.map((c) =>
          plainToInstance(RetrieveKontrakResponseDTO, {
            ...c,
            user: plainToInstance(UserBaseDTO, c.user),
            project: plainToInstance(ProjectBaseDTO, c.project),
            gaji: plainToInstance(GajiBaseDTO, c.gaji),
          }),
        ),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      handlePrismaError(err, 'KontrakByUser', userId);
    }
  }

  async getTotalCutiQuota(userId: string): Promise<number> {
    const result = await this.prisma.kontrakKerja.aggregate({
      where: {
        userId,
        status: KontrakKerjaStatus.AKTIF,
      },
      _sum: {
        cutiBulanan: true,
      },
    });

    return result._sum.cutiBulanan || 0;
  }

  async getTotalAbsensiQuota(userId: string): Promise<number> {
    const result = await this.prisma.kontrakKerja.aggregate({
      where: {
        userId,
        status: KontrakKerjaStatus.AKTIF,
      },
      _sum: {
        absensiBulanan: true,
      },
    });

    return result._sum.absensiBulanan || 0;
  }

  async update(
    id: string,
    dto: UpdateKontrakDTO,
  ): Promise<UpdateKontrakResponseDTO> {
    try {
      const target = this.findById(id);
      if (!target) throw new NotFoundException('Kontrak data not found');

      const query = await this.prisma.kontrakKerja.update({
        where: { id },
        data: dto,
      });
      return plainToInstance(UpdateKontrakResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Kontrak', id);
    }
  }

  async endContract(id: string): Promise<UpdateKontrakResponseDTO> {
    try {
      const target = this.findById(id);
      if (!target) throw new NotFoundException('Kontrak data not found');

      const query = await this.prisma.kontrakKerja.update({
        where: { id },
        data: {
          endDate: new Date(),
        },
      });
      return plainToInstance(UpdateKontrakResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Kontrak', id);
    }
  }

  async remove(id: string): Promise<DeleteKontrakResponseDTO> {
    try {
      const target = this.findById(id);
      if (!target) throw new NotFoundException('Kontrak data not found');

      const query = await this.prisma.kontrakKerja.delete({
        where: { id },
      });
      return plainToInstance(DeleteKontrakResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Kontrak', id);
    }
  }
}
