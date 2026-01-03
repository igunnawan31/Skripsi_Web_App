import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { handlePrismaError } from 'src/common/errors/prisma-exception';
import { IProjectRepository } from '../../domain/repositories/project.repository.interface';
import { PrismaService } from 'src/modules/database/prisma/prisma.service';
import { ProjectFilterDTO } from '../../application/dtos/request/project-filter.dto';
import { RetrieveAllProjectResponseDTO, RetrieveProjectResponseDTO, RetrieveTeamResponseDTO } from '../../application/dtos/response/read-response.dto';
import { ProjectTeamBaseDTO } from '../../application/dtos/base.dto';
import { KontrakBaseDTO } from 'src/modules/kontrak/application/dtos/base.dto';
import { InternalCreateProjectDTO } from '../../application/dtos/request/create-project.dto';
import { CreateProjectResponseDTO } from '../../application/dtos/response/create-response.dto';
import { InternalUpdateProjectDTO } from '../../application/dtos/request/update-project.dto';
import { UpdateProjectResponseDTO } from '../../application/dtos/response/update-response.dto';
@Injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(private readonly prisma: PrismaService) { }
  async findAll(
    filters: ProjectFilterDTO,
  ): Promise<RetrieveAllProjectResponseDTO | null> {
    try {
      const {
        searchTerm,
        minStartDate,
        maxEndDate,
        status,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = filters;

      const where: Prisma.ProjectWhereInput = {
        startDate: { gte: minStartDate ? new Date(minStartDate) : undefined },
        endDate: { lte: maxEndDate ? new Date(maxEndDate) : undefined },
        status: status ?? undefined,
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
      const orderBy: Prisma.ProjectOrderByWithRelationInput = {};
      if (sortBy && ['createdAt', 'startDate', 'endDate'].includes(sortBy)) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.createdAt = 'desc';
      }

      const [projects, total] = await this.prisma.$transaction([
        this.prisma.project.findMany({
          where,
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
          include: {
            projectTeams: true,
            kontrak: true,
          },
        }),
        this.prisma.project.count({ where }),
      ]);

      if (!projects) return null;

      return plainToInstance(RetrieveAllProjectResponseDTO, {
        data: projects.map((p) =>
          plainToInstance(RetrieveProjectResponseDTO, {
            ...p,
            projectTeams: plainToInstance(ProjectTeamBaseDTO, p.projectTeams),
            kontrak: plainToInstance(KontrakBaseDTO, p.kontrak),
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
      handlePrismaError(err, 'Project');
    }
  }
  async findById(id: string): Promise<RetrieveProjectResponseDTO | null> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id },
        include: {
          projectTeams: true,
          kontrak: true,
        },
      });
      if (!project) return null;
      return plainToInstance(RetrieveProjectResponseDTO, {
        ...project,
        projectTeams: plainToInstance(
          ProjectTeamBaseDTO,
          project ? project.projectTeams : {},
        ),
        kontrak: plainToInstance(
          KontrakBaseDTO,
          project ? project.kontrak : {},
        ),
      });
    } catch (err) {
      handlePrismaError(err, 'Project', id);
    }
  }
  async findTeamById(id: string): Promise<RetrieveTeamResponseDTO[] | null> {
    try {
      const personel = await this.prisma.projectTeam.findMany({
        where: { projectId: id },
      });
      if (!personel) return null;
      return personel.map((p) => plainToInstance(RetrieveTeamResponseDTO, p));
    } catch (err) {
      handlePrismaError(err, 'Project');
    }
  }
  async create(
    data: InternalCreateProjectDTO,
  ): Promise<CreateProjectResponseDTO> {
    try {
      const query = await this.prisma.project.create({
        data: {
          ...data,
          documents: data.documents ? (data.documents as any[]) : undefined,
        },
      });
      return plainToInstance(CreateProjectResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Project');
    }
  }

  async update(
    id: string,
    data: InternalUpdateProjectDTO,
  ): Promise<UpdateProjectResponseDTO> {
    try {
      const query = await this.prisma.project.update({
        where: { id },
        data: {
          ...data,
          documents: data.documents as any[],
        },
      });
      return plainToInstance(UpdateProjectResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Project');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.project.delete({
        where: { id },
      });
    } catch (err) {
      handlePrismaError(err, 'Project');
    }
  }

  async removePersonel(
    projectId: string,
    userId: string,
  ): Promise<void> {
    await this.prisma.projectTeam.delete({
      where: { projectId_userId: { projectId, userId } },
    });
  }
}
