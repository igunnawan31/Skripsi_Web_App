import { Injectable, NotFoundException } from '@nestjs/common';
import { MinorRole, Prisma, StatusCuti } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { handlePrismaError } from 'src/common/errors/prisma-exception';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { ApprovalCutiInput } from 'src/cuti/application/dtos/request/approval.dto';
import { CreateCutiDTO } from 'src/cuti/application/dtos/request/create-cuti.dto';
import { CutiFilterDTO } from 'src/cuti/application/dtos/request/filter-cuti.dto';
import { UpdateCutiDTO } from 'src/cuti/application/dtos/request/update-cuti.dto';
import { CreateCutiResponseDTO } from 'src/cuti/application/dtos/response/create-response.dto';
import { DeleteCutiResponseDTO } from 'src/cuti/application/dtos/response/delete-response.dto';
import {
  RetrieveAllCutiResponseDTO,
  RetrieveCutiResponseDTO,
} from 'src/cuti/application/dtos/response/read-response.dto';
import { UpdateCutiResponseDTO } from 'src/cuti/application/dtos/response/update-response.dto';
import { ICutiRepository } from 'src/cuti/domain/repositories/cuti.repository.interface';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { UserBaseDTO } from 'src/users/application/dtos/base.dto';

@Injectable()
export class CutiRepository implements ICutiRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: string): Promise<RetrieveCutiResponseDTO> {
    try {
      const cuti = await this.prisma.cuti.findUnique({
        where: { id },
        include: {
          user: true,
          approver: true,
        },
      });
      if (!cuti) throw new NotFoundException('Cuti data not found');
      return plainToInstance(RetrieveCutiResponseDTO, {
        ...cuti,
        user: plainToInstance(UserBaseDTO, cuti.user),
        approver: plainToInstance(UserBaseDTO, cuti.approver),
      });
    } catch (err) {
      handlePrismaError(err, 'Cuti', id);
    }
  }
  async findByUserId(
    userId: string,
    filters: CutiFilterDTO,
  ): Promise<RetrieveAllCutiResponseDTO> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;
    try {
      const where: Prisma.CutiWhereInput = {
        userId,
      };
      const orderBy: Prisma.CutiOrderByWithRelationInput = {};
      if (sortBy && ['createdAt', 'startDate', 'endDate'].includes(sortBy)) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.createdAt = 'desc';
      }
      const [cutis, total] = await this.prisma.$transaction([
        this.prisma.cuti.findMany({
          where,
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
          include: {
            user: true,
            approver: true,
          },
        }),
        this.prisma.cuti.count({ where }),
      ]);
      return plainToInstance(RetrieveAllCutiResponseDTO, {
        data: cutis.map((c) =>
          plainToInstance(RetrieveCutiResponseDTO, {
            ...c,
            user: plainToInstance(UserBaseDTO, c.user),
            approver: plainToInstance(UserBaseDTO, c.user),
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
      handlePrismaError(err, 'Cuti');
    }
  }
  async findAll(
    user: UserRequest,
    filters: CutiFilterDTO,
  ): Promise<RetrieveAllCutiResponseDTO> {
    const {
      searchTerm,
      maxEndDate,
      minStartDate,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;
    try {
      const where: Prisma.CutiWhereInput = {
        userId:
          user.majorRole === 'KARYAWAN'
            ? user.minorRole === 'HR'
              ? undefined
              : user.id
            : undefined,
        user: {
          majorRole: {
            not: user.majorRole === 'OWNER' ? undefined : 'OWNER',
          },
          minorRole:
            user.majorRole === 'OWNER'
              ? undefined
              : {
                  in: [
                    MinorRole.BACKEND,
                    MinorRole.ADMIN,
                    MinorRole.UI_UX,
                    MinorRole.FRONTEND,
                    MinorRole.PROJECT_MANAGER,
                  ],
                },
        },
        status: status ?? undefined,
        startDate: {
          gte: minStartDate ? new Date(minStartDate) : undefined,
        },
        endDate: {
          lte: maxEndDate ? new Date(maxEndDate) : undefined,
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
      const orderBy: Prisma.CutiOrderByWithRelationInput = {};
      if (sortBy && ['createdAt', 'startDate', 'endDate'].includes(sortBy)) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.createdAt = 'desc';
      }
      const [cutis, total] = await this.prisma.$transaction([
        this.prisma.cuti.findMany({
          where,
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
          include: {
            user: true,
            approver: true,
          },
        }),
        this.prisma.cuti.count({ where }),
      ]);
      return plainToInstance(RetrieveAllCutiResponseDTO, {
        data: cutis.map((c) =>
          plainToInstance(RetrieveCutiResponseDTO, {
            ...c,
            user: plainToInstance(UserBaseDTO, c.user),
            approver: plainToInstance(UserBaseDTO, c.user),
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
      handlePrismaError(err, 'Cuti');
    }
  }
  async findTeamCuti(
    user: UserRequest,
    filters: CutiFilterDTO,
  ): Promise<RetrieveAllCutiResponseDTO> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;
    try {
      const where: Prisma.CutiWhereInput = {
        status: 'DITERIMA',
        user: {
          majorRole: 'KARYAWAN', // exlude owner
          minorRole: { not: 'HR' }, // exclude HR
          projectTeams: {
            some: {
              project: {
                projectTeams: {
                  some: {
                    userId: user.id,
                    role: 'KETUA',
                  },
                },
              },
            },
          },
        },
      };
      const orderBy: Prisma.CutiOrderByWithRelationInput = {};
      if (sortBy && ['createdAt', 'startDate', 'endDate'].includes(sortBy)) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.createdAt = 'desc';
      }
      const [cutis, total] = await this.prisma.$transaction([
        this.prisma.cuti.findMany({
          where,
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
          include: {
            user: true,
            approver: true,
          },
        }),
        this.prisma.cuti.count({ where }),
      ]);
      return plainToInstance(RetrieveAllCutiResponseDTO, {
        data: cutis.map((c) =>
          plainToInstance(RetrieveCutiResponseDTO, {
            ...c,
            user: plainToInstance(UserBaseDTO, c.user),
            approver: plainToInstance(UserBaseDTO, c.user),
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
      handlePrismaError(err, 'Cuti');
    }
  }
  async findPendingForApprover(
    user: UserRequest,
    filters: CutiFilterDTO,
  ): Promise<RetrieveAllCutiResponseDTO> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;
    try {
      const where: Prisma.CutiWhereInput = {
        user: {
          majorRole: {
            not: user.majorRole === 'OWNER' ? undefined : 'OWNER',
          },
          minorRole:
            user.majorRole === 'OWNER'
              ? undefined
              : {
                  in: [
                    MinorRole.BACKEND,
                    MinorRole.ADMIN,
                    MinorRole.UI_UX,
                    MinorRole.FRONTEND,
                    MinorRole.PROJECT_MANAGER,
                  ],
                },
        },
      };
      const orderBy: Prisma.CutiOrderByWithRelationInput = {};
      if (sortBy && ['createdAt', 'startDate', 'endDate'].includes(sortBy)) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.createdAt = 'desc';
      }
      const [cutis, total] = await this.prisma.$transaction([
        this.prisma.cuti.findMany({
          where,
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
          include: {
            user: true,
            approver: true,
          },
        }),
        this.prisma.cuti.count({ where }),
      ]);
      return plainToInstance(RetrieveAllCutiResponseDTO, {
        data: cutis.map((c) =>
          plainToInstance(RetrieveCutiResponseDTO, {
            ...c,
            user: plainToInstance(UserBaseDTO, c.user),
            approver: plainToInstance(UserBaseDTO, c.user),
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
      handlePrismaError(err, 'Cuti');
    }
  }
  async checkOverlap(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<boolean> {
    try {
      const query = this.prisma.cuti.findFirst({
        where: {
          userId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      });
      return !query;
    } catch (err) {
      handlePrismaError(err, 'Cuti');
    }
  }
  async countUsedCutiDays(
    userId: string,
    year: number,
    month: number,
  ): Promise<number> {
    try {
      const cutiList = await this.prisma.cuti.findMany({
        where: {
          userId,
          status: StatusCuti.DITERIMA,
          OR: [
            {
              // Cuti starts in this month
              startDate: {
                gte: new Date(year, month - 1, 1),
                lt: new Date(year, month, 1),
              },
            },
            {
              // Cuti ends in this month
              endDate: {
                gte: new Date(year, month - 1, 1),
                lt: new Date(year, month, 1),
              },
            },
            {
              // Cuti spans across this month
              AND: [
                { startDate: { lt: new Date(year, month - 1, 1) } },
                { endDate: { gte: new Date(year, month, 1) } },
              ],
            },
          ],
        },
      });

      // Calculate total days in this specific month
      let totalDays = 0;
      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0); // Last day of month

      for (const cuti of cutiList) {
        const rangeStart =
          cuti.startDate < monthStart ? monthStart : cuti.startDate;
        const rangeEnd = cuti.endDate > monthEnd ? monthEnd : cuti.endDate;

        const days =
          Math.ceil(
            (rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24),
          ) + 1;

        totalDays += days;
      }

      return totalDays;
    } catch (err) {
      handlePrismaError(err, 'Cuti');
    }
  }
  async findByMonth(
    userId: string,
    year: number,
    month: number,
    filters: CutiFilterDTO,
  ): Promise<RetrieveAllCutiResponseDTO> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;
    try {
      const where: Prisma.CutiWhereInput = {
        userId,
        OR: [
          {
            startDate: {
              gte: new Date(year, month - 1, 1),
              lt: new Date(year, month, 1),
            },
          },
          {
            endDate: {
              gte: new Date(year, month - 1, 1),
              lt: new Date(year, month, 1),
            },
          },
        ],
      };
      const orderBy: Prisma.CutiOrderByWithRelationInput = {};
      if (sortBy && ['createdAt', 'startDate', 'endDate'].includes(sortBy)) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.createdAt = 'desc';
      }
      const [cutis, total] = await this.prisma.$transaction([
        this.prisma.cuti.findMany({
          where,
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
          include: {
            user: true,
            approver: true,
          },
        }),
        this.prisma.cuti.count({ where }),
      ]);

      return plainToInstance(RetrieveAllCutiResponseDTO, {
        data: cutis.map((c) => plainToInstance(RetrieveCutiResponseDTO, c)),
        meta: {
          total,
          page,
          limit,
          totalPage: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      handlePrismaError(err, 'Cuti');
    }
  }
  async create(
    data: CreateCutiDTO,
    /* approverId: string, */
  ): Promise<CreateCutiResponseDTO> {
    const { userId, startDate, endDate, reason } = data;
    try {
      const query = await this.prisma.cuti.create({
        data: {
          userId,
          /*approverId, */
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          reason,
        },
      });
      return plainToInstance(CreateCutiResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Cuti');
    }
  }
  async update(
    id: string,
    data: UpdateCutiDTO,
  ): Promise<UpdateCutiResponseDTO> {
    try {
      const target = await this.findById(id);
      if (!target) throw new NotFoundException('Cuti data not found');
      const query = await this.prisma.cuti.update({
        where: { id },
        data: {
          ...data,
          status: target.status,
          approverId: target.approverId ?? undefined,
        },
      });
      return plainToInstance(UpdateCutiResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Cuti', id);
    }
  }
  async cutiApproval(
    id: string,
    data: ApprovalCutiInput,
    approverId?: string,
  ): Promise<UpdateCutiResponseDTO> {
    try {
      const target = await this.findById(id);
      if (!target) throw new NotFoundException('Cuti data not found');
      const query = await this.prisma.cuti.update({
        where: { id },
        data: {
          ...data,
          approverId: approverId ?? undefined,
        },
      });
      return plainToInstance(UpdateCutiResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Cuti', id);
    }
  }
  async remove(id: string): Promise<DeleteCutiResponseDTO> {
    try {
      const target = await this.findById(id);
      if (!target) throw new NotFoundException('Cuti data not found');
      const query = await this.prisma.cuti.delete({
        where: { id },
      });
      return plainToInstance(DeleteCutiResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Cuti', id);
    }
  }
}
