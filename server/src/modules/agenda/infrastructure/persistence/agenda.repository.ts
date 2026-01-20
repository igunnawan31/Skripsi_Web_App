import { Injectable } from '@nestjs/common';
import { IAgendaRepository } from '../../domain/repositories/agenda.repository.interface';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { InternalAgendaFilterDTO } from '../../application/dtos/request/filter.dto';
import {
  RetrieveAgendaOccurrencesResponseDTO,
  RetrieveAgendaResponseDTO,
  RetrieveAllAgendaResponseDTO,
} from '../../application/dtos/response/read.dto';
import { InternalCreateAgendaDTO } from '../../application/dtos/request/create.dto';
import { CreateAgendaResponseDTO } from '../../application/dtos/response/create.dto';
import {
  InternalUpdateAgendaDTO,
  InternalUpdateAgendaOccurrenceDTO,
} from '../../application/dtos/request/update.dto';
import {
  UpdateAgendaOccurrenceResponseDTO,
  UpdateAgendaResponseDTO,
} from '../../application/dtos/response/update.dto';
import { LoggerService } from 'src/modules/logger/logger.service';
import { PrismaService } from 'src/modules/database/prisma/prisma.service';
import { handlePrismaError } from 'src/common/errors/prisma-exception';
import { Prisma } from '@prisma/client';
import {
  AgendaSortField,
  ALLOWED_AGENDA_SORT_FIELDS,
} from 'src/common/types/Filter.dto';
import { plainToInstance } from 'class-transformer';
import { ProjectBaseDTO } from 'src/modules/project/application/dtos/base.dto';
import { AgendaOccurrencesBaseDTO } from '../../application/dtos/base.dto';

@Injectable()
export class AgendaRepository implements IAgendaRepository {
  constructor(
    private readonly logger: LoggerService,
    private readonly prisma: PrismaService,
  ) { }
  async findAll(
    filters: InternalAgendaFilterDTO,
    user: UserRequest,
  ): Promise<RetrieveAllAgendaResponseDTO | null> {
    const {
      searchTerm,
      status,
      frequency,
      minEventDate,
      maxEventDate,
      page = 1,
      limit = 10,
      sortBy = 'desc',
      sortOrder = 'createdAt',
    } = filters;
    try {
      const where: Prisma.AgendaWhereInput = {
        status: status ?? undefined,
        frequency: frequency ?? undefined,
        eventDate: {
          gte: minEventDate ? new Date(minEventDate) : undefined,
          lte: maxEventDate ? new Date(maxEventDate) : undefined,
        },
        OR: [
          {
            projectId: null,
          },
          {
            project: {
              projectTeams: {
                some: {
                  userId:
                    user.majorRole === 'KARYAWAN'
                      ? user.minorRole === 'HR'
                        ? undefined // HR melihat semua
                        : user.id // Karyawan non-HR
                      : undefined, // Non-KARYAWAN
                },
              },
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
            title: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
        ];
      }

      const orderBy: Prisma.AgendaOrderByWithRelationInput = {};
      if (
        sortBy &&
        ALLOWED_AGENDA_SORT_FIELDS.includes(sortBy as AgendaSortField)
      ) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.title = 'asc';
      }

      const [agendas, total] = await this.prisma.$transaction([
        this.prisma.agenda.findMany({
          where,
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
          include: {
            occurrences: true,
            project: true,
          },
        }),
        this.prisma.agenda.count({ where }),
      ]);

      if (!agendas) return null;

      return plainToInstance(RetrieveAllAgendaResponseDTO, {
        data: agendas.map((r) =>
          plainToInstance(RetrieveAgendaResponseDTO, {
            ...r,
            project: plainToInstance(ProjectBaseDTO, r.project),
            occurrences: r.occurrences.map((o) =>
              plainToInstance(AgendaOccurrencesBaseDTO, o),
            ),
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
      handlePrismaError(err, 'Agenda', '', this.logger);
    }
  }
  async findById(id: string): Promise<RetrieveAgendaResponseDTO | null> {
    try {
      const agenda = await this.prisma.agenda.findUnique({
        where: { id },
        include: {
          occurrences: true,
          project: true,
        },
      });
      if (!agenda) return null;
      return plainToInstance(RetrieveAgendaResponseDTO, {
        ...agenda,
        project: agenda.project
          ? plainToInstance(ProjectBaseDTO, agenda.project)
          : null,
        occurrences: plainToInstance(
          AgendaOccurrencesBaseDTO,
          agenda.occurrences,
        ),
      });
    } catch (err) {
      handlePrismaError(err, 'Agenda', id, this.logger);
    }
  }
  async findOccurenceById(
    id: string,
  ): Promise<RetrieveAgendaOccurrencesResponseDTO | null> {
    try {
      const agendaOccurrence = await this.prisma.agendaOccurrence.findUnique({
        where: { id },
      });
      if (!agendaOccurrence) return null;
      return plainToInstance(
        RetrieveAgendaOccurrencesResponseDTO,
        agendaOccurrence,
      );
    } catch (err) {
      handlePrismaError(err, 'Agenda', id, this.logger);
    }
  }
  async findAllOccurrences(
    year: number,
    month: number,
  ): Promise<RetrieveAgendaOccurrencesResponseDTO[] | null> {
    try {
      const where: Prisma.AgendaOccurrenceWhereInput = {
        date: {
          gte: new Date(year, month, 1),
          lte: new Date(year, month + 1, 1),
        },
      };
      const occurrences = await this.prisma.agendaOccurrence.findMany({
        where,
      });
      if (!occurrences) return null;
      return occurrences.map((o) =>
        plainToInstance(RetrieveAgendaOccurrencesResponseDTO, o),
      );
    } catch (err) {
      handlePrismaError(err, 'Agenda Occurrences', '', this.logger);
    }
  }
  async create(
    dto: InternalCreateAgendaDTO,
    occurrences: Date[],
  ): Promise<CreateAgendaResponseDTO> {
    try {
      const query = await this.prisma.$transaction(async (tx) => {
        const newAgenda = await tx.agenda.create({
          data: {
            title: dto.title,
            eventDate: dto.eventDate,
            projectId: dto.projectId ?? undefined,
            timezone: dto.timezone,
            frequency: dto.frequency ?? undefined,
          },
        });

        if (occurrences.length > 0) {
          await tx.agendaOccurrence.createMany({
            data: occurrences.map((date) => ({
              agendaId: newAgenda.id,
              date,
              isCancelled: false,
            })),
          });
        }

        const data = await tx.agenda.findUnique({
          where: { id: newAgenda.id },
          include: { project: true, occurrences: true },
        });
        return data;
      });

      return plainToInstance(CreateAgendaResponseDTO, {
        ...query,
        project: query!.project
          ? plainToInstance(ProjectBaseDTO, query!.project)
          : null,
        occurrences: plainToInstance(
          AgendaOccurrencesBaseDTO,
          query?.occurrences,
        ),
      });
    } catch (err) {
      handlePrismaError(err, 'Agenda', '', this.logger);
    }
  }
  async update(
    id: string,
    dto: InternalUpdateAgendaDTO,
  ): Promise<UpdateAgendaResponseDTO> {
    try {
      const query = await this.prisma.agenda.update({
        where: { id },
        data: {
          ...dto,
        },
      });
      return plainToInstance(UpdateAgendaResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Agenda', id, this.logger);
    }
  }
  async updateWithOccurrences(
    id: string,
    data: Partial<InternalUpdateAgendaDTO>,
    occurrences: Date[],
  ): Promise<UpdateAgendaResponseDTO> {
    try {
      return this.prisma.$transaction(async (tx) => {
        const updated = await tx.agenda.update({ where: { id }, data });
        await tx.agendaOccurrence.deleteMany({ where: { agendaId: id } });
        if (occurrences.length > 0) {
          await tx.agendaOccurrence.createMany({
            data: occurrences.map((date) => ({
              agendaId: id,
              date,
              isCancelled: false,
            })),
          });
        }
        return plainToInstance(UpdateAgendaResponseDTO, updated);
      });
    } catch (err) {
      handlePrismaError(err, 'Update Agenda With Occurrence', id, this.logger);
    }
  }
  async updateOccurrence(
    id: string,
    dto: InternalUpdateAgendaOccurrenceDTO,
  ): Promise<UpdateAgendaOccurrenceResponseDTO> {
    try {
      const query = await this.prisma.agendaOccurrence.update({
        where: { id },
        data: { ...dto },
      });
      return plainToInstance(UpdateAgendaOccurrenceResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Agenda Occurrence', id, this.logger);
    }
  }
  async removeOccurrence(id: string): Promise<void> {
    try {
      const query = await this.prisma.agendaOccurrence.delete({
        where: { id },
      });
    } catch (err) {
      handlePrismaError(err, 'Agenda Occurrences', id, this.logger);
    }
  }
  async remove(id: string): Promise<void> {
    try {
      const query = await this.prisma.agenda.delete({
        where: { id },
      });
    } catch (err) {
      handlePrismaError(err, 'Agenda', id, this.logger);
    }
  }
}
