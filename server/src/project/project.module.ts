import { Module } from '@nestjs/common';
import { ProjectController } from './presentation/project.controller';
import { ProjectValidationService } from './domain/services/project-validation.service';
import { IProjectRepository } from './domain/repositories/project.repository.interface';
import { ProjectRepository } from './infrastructure/persistence/project.repository';
import { CreateProjectUseCase } from './application/use-cases/create-project.use-case';

@Module({
  controllers: [ProjectController],
  providers: [
    ProjectValidationService,
    CreateProjectUseCase,
    { provide: IProjectRepository, useClass: ProjectRepository },
  ],
  exports: [IProjectRepository],
})
export class ProjectModule { }
