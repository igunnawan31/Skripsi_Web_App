import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma/prisma.service';
import { IPertanyaanRepository } from '../../domain/repositories/pertanyaan.repository.interface';
import { LoggerService } from 'src/modules/logger/logger.service';
import { handlePrismaError } from 'src/common/errors/prisma-exception';
import { PertanyaanFilterDTO } from '../../application/dtos/request/pertanyaan/filter-question.dto';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import {
  RetrieveAllPertanyaanResponseDTO,
  RetrievePertanyaanResponseDTO,
} from '../../application/dtos/response/pertanyaan/read-response.dto';
import { CreatePertanyaanDTO } from '../../application/dtos/request/pertanyaan/create-question.dto';
import { CreatePertanyaanResponseDTO } from '../../application/dtos/response/pertanyaan/create-response.dto';
import { UpdatePertanyaanResponseDTO } from '../../application/dtos/response/pertanyaan/update-response.dto';
import { Prisma } from '@prisma/client';
import {
  ALLOWED_PERTANYAAN_KPI_SORT_FIELDS,
  PertanyaanKPISortField,
} from 'src/common/types/Filter.dto';
import { plainToInstance } from 'class-transformer';
import { IndikatorKPIBaseDTO } from '../../application/dtos/indikatorKPI.dto';
import { JawabanKPIBaseDTO } from '../../application/dtos/jawabanKPI.dto';
import { UpdatePertanyaanDTO } from '../../application/dtos/request/pertanyaan/update-question.dto';

@Injectable()
export class PertanyaanRepository implements IPertanyaanRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) { }
  async findAll(
    filters: PertanyaanFilterDTO,
  ): Promise<RetrieveAllPertanyaanResponseDTO | null> {
    try {
      const {
        searchTerm,
        kategori,
        aktif,
        bobot,
        page = 1,
        limit = 10,
        sortOrder = 'desc',
        sortBy = 'createdAt',
      } = filters;

      const where: Prisma.PertanyaanKPIWhereInput = {
        kategori: kategori ?? undefined,
        aktif: aktif ?? undefined,
        bobot: bobot ?? undefined,
      };

      if (
        searchTerm !== undefined &&
        searchTerm !== null &&
        searchTerm.trim() !== ''
      ) {
        const searchValue = searchTerm.trim();
        where.OR = [
          {
            pertanyaan: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
        ];
      }

      const orderBy: Prisma.PertanyaanKPIOrderByWithRelationInput = {};
      if (
        sortBy &&
        ALLOWED_PERTANYAAN_KPI_SORT_FIELDS.includes(
          sortBy as PertanyaanKPISortField,
        )
      ) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.urutanSoal = 'asc';
      }

      const [questions, total] = await this.prisma.$transaction([
        this.prisma.pertanyaanKPI.findMany({
          where,
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
          include: {
            indikator: true,
            jawaban: true,
          },
        }),
        this.prisma.pertanyaanKPI.count({ where }),
      ]);
      if (!questions) return null;

      return plainToInstance(RetrieveAllPertanyaanResponseDTO, {
        data: questions.map((q) =>
          plainToInstance(RetrievePertanyaanResponseDTO, {
            ...q,
            indikator: plainToInstance(IndikatorKPIBaseDTO, q.indikator),
            jawaban: plainToInstance(JawabanKPIBaseDTO, q.jawaban),
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
      handlePrismaError(err, 'Pertanyaan', '', this.logger);
    }
  }
  async findAllByIndicatorId(
    id: string,
    filters: PertanyaanFilterDTO,
  ): Promise<RetrieveAllPertanyaanResponseDTO | null> {
    try {
      const {
        searchTerm,
        kategori,
        aktif,
        bobot,
        page = 1,
        limit = 10,
        sortOrder = 'desc',
        sortBy = 'createdAt',
      } = filters;

      const where: Prisma.PertanyaanKPIWhereInput = {
        indikatorId: id,
        kategori: kategori ?? undefined,
        aktif: aktif ?? undefined,
        bobot: bobot ?? undefined,
      };

      if (
        searchTerm !== undefined &&
        searchTerm !== null &&
        searchTerm.trim() !== ''
      ) {
        const searchValue = searchTerm.trim();
        where.OR = [
          {
            pertanyaan: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
        ];
      }

      const orderBy: Prisma.PertanyaanKPIOrderByWithRelationInput = {};
      if (
        sortBy &&
        ALLOWED_PERTANYAAN_KPI_SORT_FIELDS.includes(
          sortBy as PertanyaanKPISortField,
        )
      ) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.urutanSoal = 'asc';
      }

      const [questions, total] = await this.prisma.$transaction([
        this.prisma.pertanyaanKPI.findMany({
          where,
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
        }),
        this.prisma.pertanyaanKPI.count({ where }),
      ]);
      if (!questions) return null;

      return plainToInstance(RetrieveAllPertanyaanResponseDTO, {
        data: questions.map((q) =>
          plainToInstance(RetrievePertanyaanResponseDTO, {
            ...q,
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
      handlePrismaError(err, 'Pertanyaan', id, this.logger);
    }
  }
  async findById(id: string): Promise<RetrievePertanyaanResponseDTO | null> {
    try {
      const question = await this.prisma.pertanyaanKPI.findUnique({
        where: { id },
        include: {
          indikator: true,
          jawaban: true,
        },
      });
      if (!question) return null;
      return plainToInstance(RetrievePertanyaanResponseDTO, {
        ...question,
        indikator: plainToInstance(IndikatorKPIBaseDTO, question.indikator),
        jawaban: plainToInstance(JawabanKPIBaseDTO, question.jawaban),
      });
    } catch (err) {
      handlePrismaError(err, 'Pertanyaan', id, this.logger);
    }
  }
  async create(
    data: CreatePertanyaanDTO[],
  ): Promise<number> {
    try {
      const query = await this.prisma.pertanyaanKPI.createMany({
        data: data.map((item) => ({
          indikatorId: item.indikatorId,
          kategori: item.kategori,
          pertanyaan: item.pertanyaan,
          bobot: item.bobot,
          aktif: item.aktif,
          urutanSoal: item.urutanSoal,
        })),
      });
      return query.count;
    } catch (err) {
      handlePrismaError(err, 'Pertanyaan', '', this.logger);
    }
  }
  async update(
    id: string,
    data: UpdatePertanyaanDTO,
  ): Promise<UpdatePertanyaanResponseDTO> {
    try {
      const query = await this.prisma.pertanyaanKPI.update({
        where: { id },
        data: {
          ...data,
        },
      });
      return plainToInstance(CreatePertanyaanResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Pertanyaan', id, this.logger);
    }
  }
  async remove(id: string): Promise<void> {
    try {
      const query = await this.prisma.pertanyaanKPI.delete({
        where: { id },
      });
    } catch (err) {
      handlePrismaError(err, 'Pertanyaan', id, this.logger);
    }
  }
}
