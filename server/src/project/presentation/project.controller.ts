import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IProjectRepository } from '../domain/repositories/project.repository.interface';
import { ProjectFilterDTO } from '../application/dtos/request/project-filter.dto';
import { CreateProjectDTO } from '../application/dtos/request/create-project.dto';
import { UpdateProjectDTO } from '../application/dtos/request/update-project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectRepo: IProjectRepository) { }

  @Post()
  create(@Body() createProjectDto: CreateProjectDTO) {
    return this.projectRepo.create(createProjectDto);
  }

  @Get()
  findAll(filters: ProjectFilterDTO) {
    return this.projectRepo.findAll(filters);
  }

  @Get('/personel/:id')
  findTeam(@Param('id') id: string) {
    return this.projectRepo.findTeamById(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectRepo.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDTO) {
    return this.projectRepo.update(id, updateProjectDto);
  }

  @Delete('/remove-personel/:projectId')
  removePersonel(@Param('projectId') projectId: string, @Body() userId: string) {
    return this.projectRepo.removePersonel(projectId, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectRepo.remove(id);
  }
}
