import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { handlePrismaError } from 'src/common/errors/prisma-exception';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { KontrakBaseDTO } from 'src/kontrak/application/dtos/base.dto';
import { ProjectTeamBaseDTO } from 'src/project/application/dtos/base.dto';
import { CreateProjectDTO, InternalCreateProjectDTO } from 'src/project/application/dtos/request/create-project.dto';
import { ProjectFilterDTO } from 'src/project/application/dtos/request/project-filter.dto';
import { InternalUpdateProjectDTO, UpdateProjectDTO } from 'src/project/application/dtos/request/update-project.dto';
import { CreateProjectResponseDTO } from 'src/project/application/dtos/response/create-response.dto';
import { DeleteProjectResponseDTO } from 'src/project/application/dtos/response/delete-response.dto';
import {
  RetrieveAllProjectResponseDTO,
  RetrieveProjectResponseDTO,
  RetrieveTeamResponseDTO,
} from 'src/project/application/dtos/response/read-response.dto';
import { UpdateProjectResponseDTO } from 'src/project/application/dtos/response/update-response.dto';
import { IProjectRepository } from 'src/project/domain/repositories/project.repository.interface';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(private readonly prisma: PrismaService) { }
  async findAll(
    filters: ProjectFilterDTO,
  ): Promise<RetrieveAllProjectResponseDTO> {
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
  async findById(id: string): Promise<RetrieveProjectResponseDTO> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id },
        include: {
          projectTeams: true,
          kontrak: true,
        },
      });
      if (!project) throw new NotFoundException('Project data not found');
      return plainToInstance(RetrieveProjectResponseDTO, {
        ...project,
        projectTeams: plainToInstance(ProjectTeamBaseDTO, project.projectTeams),
        kontrak: plainToInstance(KontrakBaseDTO, project.kontrak),
      });
    } catch (err) {
      handlePrismaError(err, 'Project', id);
    }
  }
  async findTeamById(id: string): Promise<RetrieveTeamResponseDTO[]> {
    try {
      const personel = await this.prisma.projectTeam.findMany({
        where: { projectId: id },
      });
      if (!personel) throw new NotFoundException('Project data not found');
      return personel.map((p) => plainToInstance(RetrieveTeamResponseDTO, p));
    } catch (err) {
      handlePrismaError(err, 'Project');
    }
  }
  async create(data: InternalCreateProjectDTO): Promise<CreateProjectResponseDTO> {
    try {
      const query = await this.prisma.project.create({
        data: {
          ...data,
          dokumen: data.dokumen ? data.dokumen as any[] : undefined,
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
      const target = await this.findById(id);
      if (!target) throw new NotFoundException('Project data not found');

      const query = await this.prisma.project.update({
        where: { id },
        data: {
          ...data,
          dokumen: data.dokumen ? data.dokumen as any[] : target.dokumen,
        },
      });
      return plainToInstance(UpdateProjectResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Project');
    }
  }

  async remove(id: string): Promise<DeleteProjectResponseDTO> {
    try {
      const target = await this.findById(id);
      if (!target) throw new NotFoundException('Project data not found');

      const query = await this.prisma.project.delete({
        where: { id },
      });
      return plainToInstance(DeleteProjectResponseDTO, query);
    } catch (err) {
      handlePrismaError(err, 'Project');
    }
  }

  async removePersonel(projectId: string, userId: string) {
    const target = this.findById(projectId);
    if (!target) throw new NotFoundException('Project data not found');

    await this.prisma.projectTeam.delete({
      where: { projectId_userId: { projectId, userId } },
    });

    const personel = await this.prisma.projectTeam.findMany({
      where: { projectId: projectId },
    });
    if (!personel) throw new NotFoundException('Project data not found');
    return personel.map((p) => plainToInstance(RetrieveTeamResponseDTO, p));
  }
}
