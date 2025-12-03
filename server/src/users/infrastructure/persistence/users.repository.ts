import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { handlePrismaError } from 'src/common/errors/prisma-exception';
import { plainToInstance } from 'class-transformer';
import { IUserRepository } from 'src/users/domain/repositories/users.repository.interface';
import { CreateUserDTO } from 'src/users/application/dtos/request/create-user.dto';
import { CreateUserResponseDTO } from 'src/users/application/dtos/response/create-response.dto';
import {
  RetrieveAllUserResponseDTO,
  RetrieveUserResponseDTO,
} from 'src/users/application/dtos/response/read-response.dto';
import { UserFilterDTO } from 'src/users/application/dtos/request/user-filter.dto';
import { UpdateUserDTO } from 'src/users/application/dtos/request/update-user.dto';
import { UpdateUserResponseDTO } from 'src/users/application/dtos/response/update-response.dto';
import { DeleteUserResponseDTO } from 'src/users/application/dtos/response/delete-response.dto';
import { Prisma } from '@prisma/client';
import { GajiBaseDTO } from 'src/gaji/application/dtos/base.dto';
import { AbsensiBaseDTO } from 'src/absensi/application/dtos/base.dto';
import { CutiBaseDTO } from 'src/cuti/application/dtos/base.dto';
import { KontrakBaseDTO } from 'src/kontrak/application/dtos/base.dto';
import { ProjectBaseDTO } from 'src/project/application/dtos/base.dto';
import { IndikatorKPIBaseDTO, IndikatorKPIPivotBaseDTO } from 'src/kpi/application/dtos/indikatorKPI.dto';
import { JawabanKPIBaseDTO } from 'src/kpi/application/dtos/jawabanKPI.dto';
import { RekapKPIBaseDTO } from 'src/kpi/application/dtos/rekapKPI.dto';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) { }
  async create(dto: CreateUserDTO): Promise<CreateUserResponseDTO> {
    try {
      const query = await this.prisma.user.create({
        data: dto,
      });
      return plainToInstance(CreateUserResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'User');
    }
  }

  async findAll(filters: UserFilterDTO): Promise<RetrieveAllUserResponseDTO> {
    try {
      const {
        searchTerm,
        majorRole,
        minorRole,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = filters;

      const where: Prisma.UserWhereInput = {
        majorRole: majorRole ?? undefined,
        minorRole: minorRole ?? undefined,
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
          {
            email: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
        ];
      }

      const orderBy: Prisma.UserOrderByWithRelationInput = {};
      if (sortBy && ['name', 'email', 'createdAt'].includes(sortBy)) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.name = 'asc';
      }

      const [users, total] = await this.prisma.$transaction([
        this.prisma.user.findMany({
          where,
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
          include: {
            absensi: true,
            cutiDiajukan: true,
            cutiDisetujui: true,
            gaji: true,
            kontrak: true,
            projectTeams: true,
            indikatorDibuat: true,
            penilaiKPI: true,
            dinilaiKPI: true,
            rekapKPI: true,
            indikatorPenilai: true,
            indikatorDinilai: true,
          },
        }),
        this.prisma.user.count({ where }),
      ]);
      return plainToInstance(RetrieveAllUserResponseDTO, {
        data: users.map((user) =>
          plainToInstance(RetrieveUserResponseDTO, {
            ...user,
            absensi: plainToInstance(AbsensiBaseDTO, user.absensi),
            cutiDiajukan: plainToInstance(CutiBaseDTO, user.cutiDiajukan),
            cutiDisetujui: plainToInstance(CutiBaseDTO, user.cutiDisetujui),
            gaji: plainToInstance(GajiBaseDTO, user.gaji),
            kontrak: plainToInstance(KontrakBaseDTO, user.kontrak),
            projectTeams: plainToInstance(ProjectBaseDTO, user.projectTeams),
            indikatorDibuat: plainToInstance(
              IndikatorKPIBaseDTO,
              user.indikatorDibuat,
            ),
            penilaiKPI: plainToInstance(JawabanKPIBaseDTO, user.penilaiKPI),
            dinilaiKPI: plainToInstance(JawabanKPIBaseDTO, user.dinilaiKPI),
            rekapKPI: plainToInstance(RekapKPIBaseDTO, user.rekapKPI),
            indikatorPenilai: plainToInstance(
              IndikatorKPIPivotBaseDTO,
              user.indikatorPenilai,
            ),
            indikatorDinilai: plainToInstance(
              IndikatorKPIPivotBaseDTO,
              user.indikatorDinilai,
            ),
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
      handlePrismaError(err, 'User');
    }
  }

  async findById(id: string): Promise<RetrieveUserResponseDTO> {
    try {
      const user = this.prisma.user.findUnique({
        where: { id },
        include: {
          absensi: true,
          cutiDiajukan: true,
          cutiDisetujui: true,
          gaji: true,
          kontrak: true,
          projectTeams: true,
          indikatorDibuat: true,
          penilaiKPI: true,
          dinilaiKPI: true,
          rekapKPI: true,
          indikatorPenilai: true,
          indikatorDinilai: true,
        },
      });
      if (!user) throw new NotFoundException('User data not found');
      return plainToInstance(RetrieveUserResponseDTO, {
        ...user,
        absensi: plainToInstance(AbsensiBaseDTO, user.absensi),
        cutiDiajukan: plainToInstance(CutiBaseDTO, user.cutiDiajukan),
        cutiDisetujui: plainToInstance(CutiBaseDTO, user.cutiDisetujui),
        gaji: plainToInstance(GajiBaseDTO, user.gaji),
        kontrak: plainToInstance(KontrakBaseDTO, user.kontrak),
        projectTeams: plainToInstance(ProjectBaseDTO, user.projectTeams),
        indikatorDibuat: plainToInstance(
          IndikatorKPIBaseDTO,
          user.indikatorDibuat,
        ),
        penilaiKPI: plainToInstance(JawabanKPIBaseDTO, user.penilaiKPI),
        dinilaiKPI: plainToInstance(JawabanKPIBaseDTO, user.dinilaiKPI),
        rekapKPI: plainToInstance(RekapKPIBaseDTO, user.rekapKPI),
        indikatorPenilai: plainToInstance(
          IndikatorKPIPivotBaseDTO,
          user.indikatorPenilai,
        ),
        indikatorDinilai: plainToInstance(
          IndikatorKPIPivotBaseDTO,
          user.indikatorDinilai,
        ),
      });
    } catch (err) {
      handlePrismaError(err, 'User', id);
    }
  }

  async findByEmail(email: string): Promise<RetrieveUserResponseDTO> {
    try {
      const user = this.prisma.user.findUnique({ where: { email } });
      if (!user) throw new NotFoundException('User data not found');
      return plainToInstance(RetrieveUserResponseDTO, user);
    } catch (err) {
      handlePrismaError(err, 'User', email);
    }
  }

  async update(id: string, dto: UpdateUserDTO): Promise<UpdateUserResponseDTO> {
    try {
      const target = this.findById(id);
      if (!target) throw new NotFoundException('User data not found');

      const query = await this.prisma.user.update({
        where: { id },
        data: dto,
      });
      return plainToInstance(UpdateUserResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'User', id);
    }
  }

  async remove(id: string): Promise<DeleteUserResponseDTO> {
    try {
      const target = this.findById(id);
      if (!target) throw new NotFoundException('User data not found');

      const query = await this.prisma.user.delete({
        where: { id },
      });
      return plainToInstance(DeleteUserResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'User', id);
    }
  }
}
