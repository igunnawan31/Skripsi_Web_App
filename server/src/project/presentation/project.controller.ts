import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { IProjectRepository } from '../domain/repositories/project.repository.interface';
import { ProjectFilterDTO } from '../application/dtos/request/project-filter.dto';
import { CreateProjectDTO, InternalCreateProjectDTO } from '../application/dtos/request/create-project.dto';
import { InternalUpdateProjectDTO, UpdateProjectDTO } from '../application/dtos/request/update-project.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { RolesMinor } from 'src/common/decorators/minor-role.decorator';
import { MinorRole } from '@prisma/client';
import { CreateProjectUseCase } from '../application/use-cases/create-project.use-case';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { UpdateProjectUseCase } from '../application/use-cases/update-project.use-case';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { DeleteProjectUseCase } from '../application/use-cases/delete-project.use-case';

@Controller('project')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProjectController {
  constructor(
    private readonly projectRepo: IProjectRepository,
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
  ) { }

  // POST project/
  @Post()
  @RolesMinor(MinorRole.HR)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'projectDocument', maxCount: 5 }], {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = `./uploads/${file.fieldname}s`;
          if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
          }
          cb(null, folder);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  create(
    @Body() dto: CreateProjectDTO,
    @UploadedFiles() files: { projectDocument: Express.Multer.File[] },
  ) {
    const payload: InternalCreateProjectDTO = {
      name: dto.name,
      description: dto.description ?? undefined,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      dokumen: files.projectDocument,
    }
    return this.createProjectUseCase.execute(payload);
  }

  // GET project/
  @Get()
  @RolesMinor(MinorRole.HR)
  findAll(@Query() filters: ProjectFilterDTO) {
    return this.projectRepo.findAll(filters);
  }

  // GET project/personel/:id
  @Get('/personel/:id')
  @RolesMinor(MinorRole.PROJECT_MANAGER)
  findTeam(@Param('id') id: string) {
    return this.projectRepo.findTeamById(id);
  }

  // GET project/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectRepo.findById(id);
  }

  // PATCH project/:id
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'projectDocument', maxCount: 5 }], {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = `./uploads/${file.fieldname}s`;
          if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
          }
          cb(null, folder);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() dto : UpdateProjectDTO,
    @UploadedFiles() files: {projectDocument: Express.Multer.File[]},
    @Req() req: Request & { user: UserRequest },
  ) {
    const payload: InternalUpdateProjectDTO = {
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      dokumen: files.projectDocument,
    }
    return this.updateProjectUseCase.execute(
      id,
      payload,
      req.user,
    );
  }

  // DELETE project/remove-personel/:projectId
  @Delete('/remove-personel/:projectId')
  @RolesMinor(MinorRole.HR, MinorRole.PROJECT_MANAGER)
  removePersonel(
    @Param('projectId') projectId: string,
    @Body() userId: string,
  ) {
    return this.projectRepo.removePersonel(projectId, userId);
  }

  // DELETE project/:id
  @Delete(':id')
  @RolesMinor(MinorRole.HR)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'dokumen', maxCount: 5 }], {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = `./uploads/${file.fieldname}s`;
          if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
          }
          cb(null, folder);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  remove(@Param('id') id: string, @Req() req: Request & { user: UserRequest }) {
    return this.deleteProjectUseCase.execute(id, req.user.id);
  }
}
