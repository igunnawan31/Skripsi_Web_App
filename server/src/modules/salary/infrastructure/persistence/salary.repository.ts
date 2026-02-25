import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { handlePrismaError } from 'src/common/errors/prisma-exception';
import { ISalaryRepository } from '../../domain/repositories/salary.repository.interface';
import { PrismaService } from 'src/modules/database/prisma/prisma.service';
import { CreateSalaryResponseDTO } from '../../application/dtos/response/create-response.dto';
import { CreateSalaryDTO } from '../../application/dtos/request/create-salary.dto';
import { SalaryFilterDTO } from '../../application/dtos/request/salary-filter.dto';
import {
  RetrieveAllSalaryResponseDTO,
  RetrieveSalaryResponseDTO,
} from '../../application/dtos/response/read-response.dto';
import { UserBaseDTO } from 'src/modules/users/application/dtos/base.dto';
import { KontrakBaseDTO } from 'src/modules/kontrak/application/dtos/base.dto';
import { InternalUpdateSalaryDTO } from '../../application/dtos/request/update-salary.dto';
import { UpdateSalaryResponseDTO } from '../../application/dtos/response/update-response.dto';
import { UserRequest } from 'src/common/types/UserRequest.dto';
@Injectable()
export class SalaryRepository implements ISalaryRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateSalaryDTO): Promise<CreateSalaryResponseDTO> {
    try {
      const query = await this.prisma.salary.create({
        data: {
          ...dto,
        },
        include: {
          user: true,
          kontrak: true,
        },
      });
      return plainToInstance(CreateSalaryResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Salary');
    }
  }

  async findAll(
    filters: SalaryFilterDTO,
    user: UserRequest,
  ): Promise<RetrieveAllSalaryResponseDTO | null> {
    const {
      searchTerm,
      status,
      minDueDate,
      maxDueDate,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;
    try {
      const where: Prisma.SalaryWhereInput = {
        userId:
          user.majorRole === 'KARYAWAN'
            ? user.minorRole === 'HR'
              ? undefined
              : user.id
            : undefined,
        status: status ?? undefined,
        dueDate: {
          gte: minDueDate ? new Date(minDueDate) : undefined,
          lte: maxDueDate ? new Date(maxDueDate) : undefined,
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
      const orderBy: Prisma.SalaryOrderByWithRelationInput = {};
      if (sortBy && ['createdAt', 'dueDate'].includes(sortBy)) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.createdAt = 'desc';
      }
      const [salaries, total] = await this.prisma.$transaction([
        this.prisma.salary.findMany({
          where,
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
          include: {
            user: true,
            kontrak: true,
          },
        }),
        this.prisma.salary.count({ where }),
      ]);

      if (!salaries) return null;

      return plainToInstance(RetrieveAllSalaryResponseDTO, {
        data: salaries.map((g) =>
          plainToInstance(RetrieveSalaryResponseDTO, {
            ...g,
            user: plainToInstance(UserBaseDTO, g.user),
            kontrak: plainToInstance(KontrakBaseDTO, g.kontrak),
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
      handlePrismaError(err, 'Salary');
    }
  }

  async findById(id: string): Promise<RetrieveSalaryResponseDTO | null> {
    try {
      const gaji = this.prisma.salary.findUnique({
        where: { id },
        include: {
          user: true,
          kontrak: true,
        },
      });

      if (!gaji) throw new NotFoundException('Salary data not found');
      return plainToInstance(RetrieveSalaryResponseDTO, {
        ...gaji,
        user: plainToInstance(UserBaseDTO, gaji.user),
        kontrak: plainToInstance(KontrakBaseDTO, gaji.kontrak),
      });
    } catch (err) {
      handlePrismaError(err, 'Salary', id);
    }
  }

  async findByUserId(
    userId: string,
    filters: SalaryFilterDTO,
  ): Promise<RetrieveAllSalaryResponseDTO | null> {
    const {
      status,
      minDueDate,
      maxDueDate,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) throw new NotFoundException('User data not found');
      const where: Prisma.SalaryWhereInput = {
        status: status ?? undefined,
        dueDate: {
          gte: minDueDate ? new Date(minDueDate) : undefined,
          lte: maxDueDate ? new Date(maxDueDate) : undefined,
        },
      };
      const orderBy: Prisma.SalaryOrderByWithRelationInput = {};
      if (sortBy && ['createdAt', 'dueDate'].includes(sortBy)) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.createdAt = 'desc';
      }
      const [salaries, total] = await this.prisma.$transaction([
        this.prisma.salary.findMany({
          where,
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
          include: {
            user: true,
            kontrak: true,
          },
        }),
        this.prisma.salary.count({ where }),
      ]);
      if (!salaries) return null;
      return plainToInstance(RetrieveAllSalaryResponseDTO, {
        data: salaries.map((g) =>
          plainToInstance(RetrieveSalaryResponseDTO, {
            ...g,
            user: plainToInstance(UserBaseDTO, g.user),
            kontrak: plainToInstance(KontrakBaseDTO, g.kontrak),
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
      handlePrismaError(err, 'Salary');
    }
  }

  async findByKontrakId(
    kontrakId: string,
  ): Promise<RetrieveSalaryResponseDTO[] | null> {
    try {
      const data = await this.prisma.salary.findMany({ where: { kontrakId } });
      if (!data) return null;
      return data.map((d) => plainToInstance(RetrieveSalaryResponseDTO, d));
    } catch (err) {
      handlePrismaError(err, 'Salary');
    }
  }
  async findByKontrakIdAndPeriode(
    kontrakId: string,
    periode: string,
  ): Promise<RetrieveSalaryResponseDTO | null> {
    try {
      const data = await this.prisma.salary.findFirst({
        where: {
          kontrakId,
          periode,
        },
      });

      if (!data) return null;

      return plainToInstance(RetrieveSalaryResponseDTO, data);
    } catch (err) {
      handlePrismaError(err, 'Salary');
    }
  }
  async update(
    id: string,
    dto: InternalUpdateSalaryDTO,
  ): Promise<UpdateSalaryResponseDTO> {
    try {
      const target = this.findById(id);
      if (!target) throw new NotFoundException('Salary data not found');

      const query = await this.prisma.salary.update({
        where: { id },
        data: {
          ...dto,
          paychecks: dto.paychecks as any[],
        },
      });

      return plainToInstance(UpdateSalaryResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Salary', id);
    }
  }

  async paySalary(id: string): Promise<UpdateSalaryResponseDTO> {
    try {
      const target = this.findById(id);
      if (!target) throw new NotFoundException('Salary data not found');

      const query = await this.prisma.salary.update({
        where: { id },
        data: {
          paymentDate: new Date(),
        },
      });

      return plainToInstance(UpdateSalaryResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Salary', id);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const target = this.findById(id);
      if (!target) throw new NotFoundException('Salary Data not found');

      const query = await this.prisma.salary.delete({
        where: { id },
      });
    } catch (err) {
      handlePrismaError(err, 'Salary', id);
    }
  }
}
