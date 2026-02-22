import { Injectable } from '@nestjs/common';
import { IRekapRepository } from '../../domain/repositories/rekap.repository.interface';
import { PrismaService } from 'src/modules/database/prisma/prisma.service';
import { LoggerService } from 'src/modules/logger/logger.service';
import { CreateIndikatorRekapDTO } from '../../application/dtos/request/rekap/create-rekap.dto';
import { CreateIndikatorRekapResponseDTO } from '../../application/dtos/response/rekap/create-response.dto';
import { UpdateIndikatorRekapResponseDTO } from '../../application/dtos/response/rekap/update-response.dto';
import { UpdateIndikatorRekapDTO } from '../../application/dtos/request/rekap/update-rekap.dto';
import { handlePrismaError } from 'src/common/errors/prisma-exception';
import { plainToInstance } from 'class-transformer';
import {
  RetrieveAllIndikatorRekapResponseDTO,
  RetrieveIndikatorRekapResponseDTO,
} from '../../application/dtos/response/rekap/read-response.dto';
import { IndikatorKPIBaseDTO } from '../../application/dtos/indikatorKPI.dto';
import { UserBaseDTO } from 'src/modules/users/application/dtos/base.dto';
import { InternalRekapFilterDTO } from '../../application/dtos/request/rekap/filter-rekap.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RekapRepository implements IRekapRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}
  async findAll(
    filters: InternalRekapFilterDTO,
  ): Promise<RetrieveAllIndikatorRekapResponseDTO | null> {
    const {
      minRataRata,
      minTotalNilai,
      minCreatedAt,
      maxRataRata,
      maxTotalNilai,
      maxCreatedAt,
      userId,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      searchTerm,
    } = filters;
    try {
      const where: Prisma.RekapKPIWhereInput = {
        rataRata: {
          gte: minRataRata ?? undefined,
          lte: maxRataRata ?? undefined,
        },
        totalNilai: {
          gte: minTotalNilai ?? undefined,
          lte: maxTotalNilai ?? undefined,
        },
        userId: userId ?? undefined,
        createdAt: {
          gte: minCreatedAt ?? undefined,
          lte: maxCreatedAt ?? undefined,
        },
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
      const [recaps, total] = await this.prisma.$transaction([
        this.prisma.rekapKPI.findMany({
          where,
          include: {
            indikator: true,
            user: true,
          },
        }),
        this.prisma.rekapKPI.count({ where }),
      ]);
      if (!recaps) return null;
      return plainToInstance(RetrieveAllIndikatorRekapResponseDTO, {
        data: recaps.map((r) =>
          plainToInstance(RetrieveIndikatorRekapResponseDTO, {
            ...r,
            indikator: plainToInstance(IndikatorKPIBaseDTO, r.indikator),
            user: plainToInstance(UserBaseDTO, r.user),
          }),
        ),
        meta: {
          total,
          page,
          limit,
          totalPage: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      handlePrismaError(err, 'Indikator Rekap', '', this.logger);
    }
  }
  async findUnique(
    indikatorId: string,
    evaluateeId: string,
  ): Promise<RetrieveIndikatorRekapResponseDTO | null> {
    try {
      const recap = await this.prisma.rekapKPI.findUnique({
        where: {
          indikatorId_userId: {
            indikatorId: indikatorId,
            userId: evaluateeId,
          },
        },
      });
      if (!recap) return null;
      return plainToInstance(RetrieveIndikatorRekapResponseDTO, recap);
    } catch (err) {
      handlePrismaError(err, 'Indikator Rekap', '', this.logger);
    }
  }
  async create(
    data: CreateIndikatorRekapDTO,
  ): Promise<CreateIndikatorRekapResponseDTO> {
    try {
      const recap = await this.prisma.rekapKPI.create({
        data: {
          indikatorId: data.indikatorId,
          userId: data.userId,
          rataRata: data.rataRata,
          totalNilai: data.totalNilai,
          jumlahPenilai: data.jumlahPenilai,
        },
      });
      return plainToInstance(CreateIndikatorRekapResponseDTO, recap);
    } catch (err) {
      handlePrismaError(err, 'Indikator Rekap', '', this.logger);
    }
  }
  async update(
    id: string,
    data: UpdateIndikatorRekapDTO,
  ): Promise<UpdateIndikatorRekapResponseDTO> {
    try {
      const recap = await this.prisma.rekapKPI.update({
        where: {
          id,
        },
        data,
      });
      return plainToInstance(UpdateIndikatorRekapResponseDTO, recap);
    } catch (err) {
      handlePrismaError(err, 'Indikator Rekap', id, this.logger);
    }
  }
}
