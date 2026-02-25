import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { handlePrismaError } from 'src/common/errors/prisma-exception';
import {
  ALLOWED_REIMBURSE_SORT_FIELDS,
  ReimburseSortField,
} from 'src/common/types/Filter.dto';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { IReimburseRepository } from '../../domain/repositories/reimburse.repository.interface';
import { PrismaService } from 'src/modules/database/prisma/prisma.service';
import { LoggerService } from 'src/modules/logger/logger.service';
import { InternalReimburseFilterDTO } from '../../application/dtos/request/filter.dto';
import { RetrieveAllReimburseResponseDTO, RetrieveReimburseResponseDTO } from '../../application/dtos/response/read.dto';
import { UserBaseDTO } from 'src/modules/users/application/dtos/base.dto';
import { InternalCreateReimburseDTO } from '../../application/dtos/request/create.dto';
import { CreateReimburseResponseDTO } from '../../application/dtos/response/create.dto';
import { InternalUpdateReimburseDTO } from '../../application/dtos/request/update.dto';
import { UpdateReimburseResponseDTO } from '../../application/dtos/response/update.dto';

@Injectable()
export class ReimburseRepository implements IReimburseRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) { }
  async findAll(
    filters: InternalReimburseFilterDTO,
    user: UserRequest,
  ): Promise<RetrieveAllReimburseResponseDTO | null> {
    const {
      searchTerm,
      minExpenses,
      maxExpenses,
      minSubmittedDate,
      maxSubmittedDate,
      approvalStatus,
      page = 1,
      limit = 10,
      sortOrder = 'desc',
      sortBy = 'createdAt',
    } = filters;
    try {
      const where: Prisma.ReimburseWhereInput = {
        userId:
          user.majorRole === 'KARYAWAN'
            ? user.minorRole === 'ADMIN'
              ? undefined
              : user.id
            : undefined,
        totalExpenses: {
          gte: minExpenses ?? undefined,
          lte: maxExpenses ?? undefined,
        },
        approvalStatus: approvalStatus ?? undefined,
        createdAt: {
          gte: minSubmittedDate ?? undefined,
          lte: maxSubmittedDate ?? undefined,
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
            title: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
          {
            requester: {
              name: {
                contains: searchValue,
                mode: 'insensitive',
              },
            },
          },
        ];
      }

      const orderBy: Prisma.ReimburseOrderByWithRelationInput = {};
      if (
        sortBy &&
        ALLOWED_REIMBURSE_SORT_FIELDS.includes(sortBy as ReimburseSortField)
      ) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.title = 'asc';
      }

      const [reimburses, total] = await this.prisma.$transaction([
        this.prisma.reimburse.findMany({
          where,
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
          include: {
            requester: true,
            approver: true,
          },
        }),
        this.prisma.reimburse.count({ where }),
      ]);

      if (!reimburses) return null;

      return plainToInstance(RetrieveAllReimburseResponseDTO, {
        data: reimburses.map((r) =>
          plainToInstance(RetrieveReimburseResponseDTO, {
            ...r,
            requester: plainToInstance(UserBaseDTO, r.requester),
            approver: plainToInstance(UserBaseDTO, r.approver),
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
      handlePrismaError(err, 'Reimburse', '', this.logger);
    }
  }
  async findById(id: string): Promise<RetrieveReimburseResponseDTO | null> {
    try {
      const reimburse = await this.prisma.reimburse.findUnique({
        where: { id },
        include: {
          requester: true,
          approver: true,
        },
      });

      if (!reimburse) return null;

      return plainToInstance(RetrieveReimburseResponseDTO, {
        ...reimburse,
        requester: plainToInstance(UserBaseDTO, reimburse.requester),
        approver: plainToInstance(UserBaseDTO, reimburse.approver),
      });
    } catch (err) {
      handlePrismaError(err, 'Reimburse', id, this.logger);
    }
  }
  async create(
    dto: InternalCreateReimburseDTO,
  ): Promise<CreateReimburseResponseDTO> {
    try {
      const query = await this.prisma.reimburse.create({
        data: {
          ...dto,
          documents: dto.documents ? dto.documents as any[] : undefined,
        },
      });
      return plainToInstance(CreateReimburseResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Reimburse', '', this.logger);
    }
  }
  async update(
    id: string,
    dto: InternalUpdateReimburseDTO,
  ): Promise<UpdateReimburseResponseDTO> {
    try {
      const query = await this.prisma.reimburse.update({
        where: { id },
        data: {
          ...dto,
          documents: dto.documents as any[], // [{FileMetaData}]
        },
      });
      return plainToInstance(UpdateReimburseResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Reimburse', id, this.logger);
    }
  }
  async remove(id: string): Promise<void> {
    try {
      const query = await this.prisma.reimburse.delete({
        where: { id },
      });
    } catch (err) {
      handlePrismaError(err, 'Reimburse', id, this.logger);
    }
  }
}
