import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { handlePrismaError } from 'src/common/errors/prisma-exception';
import { IGajiRepository } from '../../domain/repositories/gaji.repository.interface';
import { PrismaService } from 'src/modules/database/prisma/prisma.service';
import { CreateGajiResponseDTO } from '../../application/dtos/response/create-response.dto';
import { CreateGajiDTO } from '../../application/dtos/request/create-gaji.dto';
import { GajiFilterDTO } from '../../application/dtos/request/gaji-filter.dto';
import { RetrieveAllGajiResponseDTO, RetrieveGajiResponseDTO } from '../../application/dtos/response/read-response.dto';
import { UserBaseDTO } from 'src/modules/users/application/dtos/base.dto';
import { KontrakBaseDTO } from 'src/modules/kontrak/application/dtos/base.dto';
import { UpdateGajiResponseDTO } from '../../application/dtos/response/update-response.dto';
import { UpdateGajiDTO } from '../../application/dtos/request/update-gaji.dto';
@Injectable()
export class GajiRepository implements IGajiRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateGajiDTO): Promise<CreateGajiResponseDTO> {
    try {
      const query = await this.prisma.gaji.create({
        data: {
          ...dto,
        },
        include: {
          user: true,
          kontrak: true,
        },
      });
      return plainToInstance(CreateGajiResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Gaji');
    }
  }

  async findAll(filters: GajiFilterDTO): Promise<RetrieveAllGajiResponseDTO> {
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
      const where: Prisma.GajiWhereInput = {
        status: status ?? undefined,
        dueDate: {
          gte: minDueDate ? new Date(minDueDate) : undefined,
          lte: maxDueDate ? new Date(maxDueDate) : undefined,
        },
      };
      const orderBy: Prisma.GajiOrderByWithRelationInput = {};
      if (sortBy && ['createdAt', 'dueDate'].includes(sortBy)) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.createdAt = 'desc';
      }
      const [gajis, total] = await this.prisma.$transaction([
        this.prisma.gaji.findMany({
          where,
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
          include: {
            user: true,
            kontrak: true,
          },
        }),
        this.prisma.gaji.count({ where }),
      ]);
      return plainToInstance(RetrieveAllGajiResponseDTO, {
        data: gajis.map((g) =>
          plainToInstance(RetrieveGajiResponseDTO, {
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
      handlePrismaError(err, 'Gaji');
    }
  }

  async findById(id: string): Promise<RetrieveGajiResponseDTO> {
    try {
      const gaji = this.prisma.gaji.findUnique({
        where: { id },
        include: {
          user: true,
          kontrak: true,
        },
      });

      if (!gaji) throw new NotFoundException('Gaji data not found');
      return plainToInstance(RetrieveGajiResponseDTO, {
        ...gaji,
        user: plainToInstance(UserBaseDTO, gaji.user),
        kontrak: plainToInstance(KontrakBaseDTO, gaji.kontrak),
      });
    } catch (err) {
      handlePrismaError(err, 'Gaji', id);
    }
  }

  async findByUserId(
    userId: string,
    filters: GajiFilterDTO,
  ): Promise<RetrieveAllGajiResponseDTO> {
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
      const where: Prisma.GajiWhereInput = {
        status: status ?? undefined,
        dueDate: {
          gte: minDueDate ? new Date(minDueDate) : undefined,
          lte: maxDueDate ? new Date(maxDueDate) : undefined,
        },
      };
      const orderBy: Prisma.GajiOrderByWithRelationInput = {};
      if (sortBy && ['createdAt', 'dueDate'].includes(sortBy)) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.createdAt = 'desc';
      }
      const [gajis, total] = await this.prisma.$transaction([
        this.prisma.gaji.findMany({
          where,
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
          include: {
            user: true,
            kontrak: true,
          },
        }),
        this.prisma.gaji.count({ where }),
      ]);
      return plainToInstance(RetrieveAllGajiResponseDTO, {
        data: gajis.map((g) =>
          plainToInstance(RetrieveGajiResponseDTO, {
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
      handlePrismaError(err, 'Gaji');
    }
  }

  async findByKontrakId(kontrakId: string): Promise<RetrieveGajiResponseDTO[]> {
    try {
      const data = await this.prisma.gaji.findMany({ where: { kontrakId } });
      return data.map((d) => plainToInstance(RetrieveGajiResponseDTO, d));
    } catch (err) {
      handlePrismaError(err, 'Gaji');
    }
  }
  async findByKontrakIdAndPeriode(
    kontrakId: string,
    periode: string,
  ): Promise<RetrieveGajiResponseDTO | null> {
    try {
      const data = await this.prisma.gaji.findFirst({
        where: {
          kontrakId,
          periode,
        },
      });

      if(!data) return null;

      return plainToInstance(RetrieveGajiResponseDTO, data);
    } catch (err) {
      handlePrismaError(err, 'Gaji');
    }
  }
  async update(id: string, dto: UpdateGajiDTO): Promise<UpdateGajiResponseDTO> {
    try {
      const target = this.findById(id);
      if (!target) throw new NotFoundException('Gaji data not found');

      const query = await this.prisma.gaji.update({
        where: { id },
        data: dto,
      });

      return plainToInstance(UpdateGajiResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Gaji', id);
    }
  }

  async paySalary(id: string): Promise<UpdateGajiResponseDTO> {
    try {
      const target = this.findById(id);
      if (!target) throw new NotFoundException('Gaji data not found');

      const query = await this.prisma.gaji.update({
        where: { id },
        data: {
          paymentDate: new Date(),
        },
      });

      return plainToInstance(UpdateGajiResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Gaji', id);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const target = this.findById(id);
      if (!target) throw new NotFoundException('Gaji Data not found');

      const query = await this.prisma.gaji.delete({
        where: { id },
      });
    } catch (err) {
      handlePrismaError(err, 'Gaji', id);
    }
  }
}
