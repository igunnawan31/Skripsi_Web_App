import { Injectable } from '@nestjs/common';
import { IIndikatorRepository } from '../../domain/repositories/indikator.repository.interface';
import { PrismaService } from 'src/modules/database/prisma/prisma.service';
import { LoggerService } from 'src/modules/logger/logger.service';
import { handlePrismaError } from 'src/common/errors/prisma-exception';
import { InternalIndikatorFilterDTO } from '../../application/dtos/request/indikator/filter-indicator.dto';
import {
  RetrieveAllIndikatorResponseDTO,
  RetrieveIndikatorResponseDTO,
} from '../../application/dtos/response/indikator/read-response.dto';
import { InternalCreateIndikatorDTO } from '../../application/dtos/request/indikator/create-indicator.dto';
import { CreateIndikatorResponseDTO } from '../../application/dtos/response/indikator/create-response.dto';
import { InternalUpdateIndikatorDTO } from '../../application/dtos/request/indikator/update-indicator.dto';
import { UpdateIndikatorResponseDTO } from '../../application/dtos/response/indikator/update-response.dto';
import { Prisma } from '@prisma/client';
import {
  ALLOWED_INDIKATOR_KPI_SORT_FIELDS,
  IndikatorKPISortField,
} from 'src/common/types/Filter.dto';
import { plainToInstance } from 'class-transformer';
import { UserBaseDTO } from 'src/modules/users/application/dtos/base.dto';
import { PertanyaanKPIBaseDTO } from '../../application/dtos/pertanyaanKPI.dto';
import { IndikatorKPIPivotBaseDTO } from '../../application/dtos/indikatorKPI.dto';
import { JawabanKPIBaseDTO } from '../../application/dtos/jawabanKPI.dto';
import { RekapKPIBaseDTO } from '../../application/dtos/rekapKPI.dto';

@Injectable()
export class IndikatorRepository implements IIndikatorRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) { }

  async findAll(
    filters: InternalIndikatorFilterDTO,
  ): Promise<RetrieveAllIndikatorResponseDTO | null> {
    try {
      const {
        searchTerm,
        category,
        minStartDate,
        maxEndDate,
        statusPublic,
        status,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = filters;

      const where: Prisma.IndikatorKPIWhereInput = {
        category: category ?? undefined,
        statusPublic: statusPublic ?? undefined,
        status: status ?? undefined,
        startDate: {
          gte: minStartDate ?? undefined,
        },
        endDate: {
          lte: maxEndDate ?? undefined,
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
            name: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
        ];
      }

      const orderBy: Prisma.IndikatorKPIOrderByWithRelationInput = {};
      if (
        sortBy &&
        ALLOWED_INDIKATOR_KPI_SORT_FIELDS.includes(
          sortBy as IndikatorKPISortField,
        )
      ) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.createdAt = 'desc';
      }

      const [indicators, total] = await this.prisma.$transaction([
        this.prisma.indikatorKPI.findMany({
          where,
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
          include: {
            createdBy: true,
            pertanyaan: true,
            evaluation: true,
            jawaban: true,
            rekap: true,
          },
        }),
        this.prisma.indikatorKPI.count({ where }),
      ]);

      if (!indicators) return null;

      return plainToInstance(RetrieveAllIndikatorResponseDTO, {
        data: indicators.map((i) =>
          plainToInstance(RetrieveIndikatorResponseDTO, {
            ...i,
            createdBy: plainToInstance(UserBaseDTO, i.createdBy),
            pertanyaan: plainToInstance(PertanyaanKPIBaseDTO, i.pertanyaan),
            evaluation: plainToInstance(IndikatorKPIPivotBaseDTO, i.evaluation),
            jawaban: plainToInstance(JawabanKPIBaseDTO, i.jawaban),
            rekap: plainToInstance(RekapKPIBaseDTO, i.rekap),
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
      handlePrismaError(err, 'Indikator KPI', '', this.logger);
    }
  }
  async findById(id: string): Promise<RetrieveIndikatorResponseDTO | null> {
    try {
      const indikator = await this.prisma.indikatorKPI.findUnique({
        where: {id},
        include: {
          createdBy: true,
          pertanyaan: true,
          evaluation: true,
          jawaban: true,
          rekap: true,
        },
      });

      if (!indikator) return null;

      return plainToInstance(RetrieveIndikatorResponseDTO, {
        ...indikator,
        createdBy: plainToInstance(UserBaseDTO, indikator.createdBy),
        pertanyaan: plainToInstance(PertanyaanKPIBaseDTO, indikator.pertanyaan),
        evaluation: plainToInstance(IndikatorKPIPivotBaseDTO, indikator.evaluation),
        jawaban: plainToInstance(JawabanKPIBaseDTO, indikator.jawaban),
        rekap: plainToInstance(RekapKPIBaseDTO, indikator.rekap),
      });
    } catch (err) {
      handlePrismaError(err, 'Indikator KPI', id, this.logger);
    }
  }
  async create(
    data: InternalCreateIndikatorDTO,
  ): Promise<CreateIndikatorResponseDTO> {
    try {
      const query = await this.prisma.indikatorKPI.create({
        data: {
          ...data,
        },
      });
      return plainToInstance(CreateIndikatorResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Indikator KPI', '', this.logger);
    }
  }
  async update(
    id: string,
    data: InternalUpdateIndikatorDTO,
  ): Promise<UpdateIndikatorResponseDTO> {
    try {
      const query = await this.prisma.indikatorKPI.update({
        where: { id },
        data: {
          ...data,
        },
      });
      return plainToInstance(UpdateIndikatorResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Indikator KPI', id, this.logger);
    }
  }
  async remove(id: string): Promise<void> {
    try {
      const query = await this.prisma.indikatorKPI.delete({
        where: { id },
      });
    } catch (err) {
      handlePrismaError(err, 'Indikator KPI', id, this.logger);
    }
  }
}
