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
} from '@nestjs/common';
import { IProjectRepository } from '../domain/repositories/project.repository.interface';
import { ProjectFilterDTO } from '../application/dtos/request/project-filter.dto';
import { CreateProjectDTO } from '../application/dtos/request/create-project.dto';
import { UpdateProjectDTO } from '../application/dtos/request/update-project.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { RolesMinor } from 'src/common/decorators/minor-role.decorator';
import { MinorRole } from '@prisma/client';
import { CreateProjectUseCase } from '../application/use-cases/create-project.use-case';

@Controller('project')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProjectController {
  constructor(
    private readonly projectRepo: IProjectRepository,
    private readonly createProjectUseCase: CreateProjectUseCase,
  ) {}

  // POST project/
  @Post()
  @RolesMinor(MinorRole.HR)
  create(@Body() createProjectDto: CreateProjectDTO) {
    return this.createProjectUseCase.execute(createProjectDto);
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
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDTO) {
    return this.projectRepo.update(id, updateProjectDto);
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
  remove(@Param('id') id: string) {
    return this.projectRepo.remove(id);
  }
}
