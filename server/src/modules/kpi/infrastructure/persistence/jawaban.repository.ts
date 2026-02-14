import { Injectable } from '@nestjs/common';
import { IJawabanRepository } from '../../domain/repositories/jawaban.repository.interface';
import { PrismaService } from 'src/modules/database/prisma/prisma.service';
import { LoggerService } from 'src/modules/logger/logger.service';
import {
  RetrieveAllJawabanResponseDTO,
  RetrieveJawabanResponseDTO,
} from '../../application/dtos/response/jawaban/read-response.dto';
import { InternalJawabanFilterDTO } from '../../application/dtos/request/jawaban/filter-answer.dto';
import { CreateJawabanResponseDTO } from '../../application/dtos/response/jawaban/create-response.dto';
import { InternalCreateJawabanDTO } from '../../application/dtos/request/jawaban/create-answer.dto';
import { handlePrismaError } from 'src/common/errors/prisma-exception';
import { Prisma } from '@prisma/client';
import {
  ALLOWED_JAWABAN_KPI_SORT_FIELDS,
  JawabanKPISortField,
} from 'src/common/types/Filter.dto';
import { plainToInstance } from 'class-transformer';
import { IndikatorKPIBaseDTO } from '../../application/dtos/indikatorKPI.dto';
import { PertanyaanKPIBaseDTO } from '../../application/dtos/pertanyaanKPI.dto';
import { UserBaseDTO } from 'src/modules/users/application/dtos/base.dto';

@Injectable()
export class JawabanRepository implements IJawabanRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) { }
  async findAll(
    filters: InternalJawabanFilterDTO,
  ): Promise<RetrieveAllJawabanResponseDTO | null> {
    try {
      const {
        searchTerm,
        maxGrade,
        minGrade,
        maxCreatedDate,
        minCreatedDate,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = filters;

      const where: Prisma.JawabanKPIWhereInput = {
        nilai: {
          gte: minGrade ?? undefined,
          lte: maxGrade ?? undefined,
        },
        createdAt: {
          gte: minCreatedDate ?? undefined,
          lte: maxCreatedDate ?? undefined,
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
            evaluatee: {
              name: {
                contains: searchValue,
                mode: 'insensitive',
              },
            },
            evaluator: {
              name: {
                contains: searchValue,
                mode: 'insensitive',
              },
            },
          },
        ];
      }

      const orderBy: Prisma.JawabanKPIOrderByWithRelationInput = {};
      if (
        sortBy &&
        ALLOWED_JAWABAN_KPI_SORT_FIELDS.includes(sortBy as JawabanKPISortField)
      ) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.createdAt = 'desc';
      }

      const [answers, total] = await this.prisma.$transaction([
        this.prisma.jawabanKPI.findMany({
          where,
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
          include: {
            indikator: true,
            pertanyaan: true,
            evaluator: true,
            evaluatee: true,
          },
        }),
        this.prisma.jawabanKPI.count({ where }),
      ]);

      if (!answers) return null;

      return plainToInstance(RetrieveAllJawabanResponseDTO, {
        data: answers.map((r) =>
          plainToInstance(RetrieveJawabanResponseDTO, {
            ...r,
            indikator: plainToInstance(IndikatorKPIBaseDTO, r.indikator),
            pertanyaan: plainToInstance(PertanyaanKPIBaseDTO, r.pertanyaan),
            evaluator: plainToInstance(UserBaseDTO, r.evaluator),
            evaluatee: plainToInstance(UserBaseDTO, r.evaluatee),
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
      handlePrismaError(err, 'Jawaban', '', this.logger);
    }
  }
  async findById(id: string): Promise<RetrieveJawabanResponseDTO | null> {
    try {
      const answer = await this.prisma.jawabanKPI.findUnique({
        where: { id },
        include: {
          indikator: true,
          pertanyaan: true,
          evaluator: true,
          evaluatee: true,
        },
      });
      if (!answer) return null;
      return plainToInstance(RetrieveJawabanResponseDTO, {
        ...answer,
        indikator: plainToInstance(IndikatorKPIBaseDTO, answer.indikator),
        pertanyaan: plainToInstance(PertanyaanKPIBaseDTO, answer.pertanyaan),
        evaluator: plainToInstance(UserBaseDTO, answer.evaluator),
        evaluatee: plainToInstance(UserBaseDTO, answer.evaluatee),
      });
    } catch (err) {
      handlePrismaError(err, 'Jawaban', id, this.logger);
    }
  }
  async findUnique(
    pertanyaanId: string,
    evaluatorId: string,
    evaluateeId: string,
  ): Promise<RetrieveJawabanResponseDTO | null> {
    try {
      const answer = await this.prisma.jawabanKPI.findUnique({
        where: {
          pertanyaanId_evaluatorId_evaluateeId: {
            pertanyaanId,
            evaluatorId,
            evaluateeId,
          },
        },
        include: {
          indikator: true,
          pertanyaan: true,
          evaluator: true,
          evaluatee: true,
        },
      });
      if (!answer) return null;
      return plainToInstance(RetrieveJawabanResponseDTO, {
        ...answer,
        indikator: plainToInstance(IndikatorKPIBaseDTO, answer.indikator),
        pertanyaan: plainToInstance(PertanyaanKPIBaseDTO, answer.pertanyaan),
        evaluator: plainToInstance(UserBaseDTO, answer.evaluator),
        evaluatee: plainToInstance(UserBaseDTO, answer.evaluatee),
      });
    } catch (err) {
      handlePrismaError(err, 'Jawaban', '', this.logger);
    }
  }
  async getAllByIndicatorId(
    id: string,
  ): Promise<RetrieveJawabanResponseDTO[] | null> {
    try {
      const answers = await this.prisma.jawabanKPI.findMany({
        where: { indikatorId: id },
        include: {
          evaluator: true,
        },
      });
      if (!answers) return null;
      return answers.map((a) =>
        plainToInstance(RetrieveJawabanResponseDTO, {
          ...a,
          evaluator: plainToInstance(UserBaseDTO, a.evaluator),
        }),
      );
    } catch (err) {
      handlePrismaError(err, 'Jawaban', '', this.logger);
    }
  }
  async create(
    data: InternalCreateJawabanDTO,
  ): Promise<CreateJawabanResponseDTO> {
    try {
      const query = await this.prisma.jawabanKPI.create({
        data: {
          ...data,
        },
      });
      return plainToInstance(CreateJawabanResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Jawaban', '', this.logger);
    }
  }
  async remove(id: string): Promise<void> {
    try {
      const query = await this.prisma.jawabanKPI.delete({
        where: { id },
      });
    } catch (err) {
      handlePrismaError(err, 'Jawaban', id, this.logger);
    }
  }
}
