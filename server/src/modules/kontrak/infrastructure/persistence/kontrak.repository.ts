import { Injectable } from '@nestjs/common';
import { KontrakKerjaStatus, Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { handlePrismaError } from 'src/common/errors/prisma-exception';
import { IKontrakRepository } from '../../domain/repositories/kontrak.repository.interface';
import { PrismaService } from 'src/modules/database/prisma/prisma.service';
import { InternalCreateKontrakDTO } from '../../application/dtos/request/create-kontrak.dto';
import { CreateKontrakResponseDTO } from '../../application/dtos/response/create-response.dto';
import { KontrakFilterDTO } from '../../application/dtos/request/kontrak-filter.dto';
import {
  RetrieveAllKontrakResponseDTO,
  RetrieveKontrakResponseDTO,
} from '../../application/dtos/response/read-response.dto';
import { UserBaseDTO } from 'src/modules/users/application/dtos/base.dto';
import { ProjectBaseDTO } from 'src/modules/project/application/dtos/base.dto';
import { InternalUpdateKontrakDTO } from '../../application/dtos/request/update-kontrak.dto';
import { UpdateKontrakResponseDTO } from '../../application/dtos/response/update-response.dto';
import { SalaryBaseDTO } from 'src/modules/salary/application/dtos/base.dto';

@Injectable()
export class KontrakRepository implements IKontrakRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: InternalCreateKontrakDTO,
  ): Promise<CreateKontrakResponseDTO> {
    try {
      const query = await this.prisma.kontrakKerja.create({
        data: {
          jenis: dto.jenis,
          metodePembayaran: dto.metodePembayaran,
          dpPercentage: dto.dpPercentage ?? null,
          finalPercentage: dto.finalPercentage ?? null,
          totalBayaran: dto.totalBayaran,
          absensiBulanan: dto.absensiBulanan,
          cutiBulanan: dto.cutiBulanan,
          status: dto.status ?? 'ACTIVE',
          catatan: dto.catatan ?? null,
          startDate: dto.startDate,
          endDate: dto.endDate,
          projectId: dto.projectData.id!, // validate di use case, disini selalu available. harusnya gapernah undefined
          userId: dto.userData.id!,
          documents: dto.documents as any[], // [{FileMetaData}]
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
  ): Promise<RetrieveAllKontrakResponseDTO | null> {
    try {
      const {
        metodePembayaran,
        searchTerm,
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
        AND: [
          {
            startDate: {
              gte: minStartDate ? new Date(minStartDate) : undefined,
            },
          },
          {
            endDate: {
              lte: maxEndDate ? new Date(maxEndDate) : undefined,
            },
          },
        ],
      };

      if (
        searchTerm !== undefined &&
        searchTerm !== null &&
        searchTerm.trim() !== ''
      ) {
        const searchValue = searchTerm.trim();
        where.OR = [
          {
            user: {
              name: {
                contains: searchValue,
                mode: 'insensitive',
              },
            },
          },
        ];
      }

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
            salary: true,
          },
        }),
        this.prisma.kontrakKerja.count({ where }),
      ]);

      if (!contracts) return null;

      return plainToInstance(RetrieveAllKontrakResponseDTO, {
        data: contracts.map((c) =>
          plainToInstance(RetrieveKontrakResponseDTO, {
            ...c,
            user: plainToInstance(UserBaseDTO, c.user),
            project: plainToInstance(ProjectBaseDTO, c.project),
            salary: plainToInstance(SalaryBaseDTO, c.salary),
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

  async findById(id: string): Promise<RetrieveKontrakResponseDTO | null> {
    try {
      const kontrak = await this.prisma.kontrakKerja.findUnique({
        where: { id },
        include: {
          user: true,
          project: true,
          salary: true,
        },
      });

      if (!kontrak) return null;

      return plainToInstance(RetrieveKontrakResponseDTO, {
        ...kontrak,
        user: plainToInstance(UserBaseDTO, kontrak.user),
        project: plainToInstance(ProjectBaseDTO, kontrak.project),
        salary: plainToInstance(SalaryBaseDTO, kontrak.salary),
      });
    } catch (err) {
      handlePrismaError(err, 'Kontrak', id);
    }
  }

  async findByUserId(
    userId: string,
    filters: KontrakFilterDTO,
  ): Promise<RetrieveAllKontrakResponseDTO | null> {
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
        AND: [
          {
            startDate: {
              gte: minStartDate ? new Date(minStartDate) : undefined,
            },
          },
          {
            endDate: {
              lte: maxEndDate ? new Date(maxEndDate) : undefined,
            },
          },
        ],
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
            salary: true,
          },
        }),
        this.prisma.kontrakKerja.count({ where }),
      ]);

      if (!contracts) return null;

      return plainToInstance(RetrieveAllKontrakResponseDTO, {
        data: contracts.map((c) =>
          plainToInstance(RetrieveKontrakResponseDTO, {
            ...c,
            user: plainToInstance(UserBaseDTO, c.user),
            project: plainToInstance(ProjectBaseDTO, c.project),
            salary: plainToInstance(SalaryBaseDTO, c.salary),
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
        status: KontrakKerjaStatus.ACTIVE,
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
        status: KontrakKerjaStatus.ACTIVE,
      },
      _sum: {
        absensiBulanan: true,
      },
    });

    return result._sum.absensiBulanan || 0;
  }

  async update(
    id: string,
    dto: InternalUpdateKontrakDTO,
  ): Promise<UpdateKontrakResponseDTO> {
    try {
      const query = await this.prisma.kontrakKerja.update({
        where: { id },
        data: {
          jenis: dto.jenis,
          metodePembayaran: dto.metodePembayaran,
          dpPercentage: dto.dpPercentage ?? null,
          finalPercentage: dto.finalPercentage ?? null,
          totalBayaran: dto.totalBayaran,
          absensiBulanan: dto.absensiBulanan,
          cutiBulanan: dto.cutiBulanan,
          status: dto.status ?? 'ACTIVE',
          catatan: dto.catatan ?? null,
          startDate: dto.startDate,
          endDate: dto.endDate,
          documents: dto.documents as any[], // [{FileMetaData}]
        },
      });
      return plainToInstance(UpdateKontrakResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Kontrak', id);
    }
  }

  async endContract(id: string): Promise<UpdateKontrakResponseDTO> {
    try {
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

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.kontrakKerja.delete({
        where: { id },
      });
    } catch (err) {
      handlePrismaError(err, 'Kontrak', id);
    }
  }
}
