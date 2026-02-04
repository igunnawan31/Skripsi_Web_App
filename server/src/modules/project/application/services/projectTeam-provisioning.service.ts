import { Inject, Injectable } from '@nestjs/common';
import { IProjectRepository } from '../../domain/repositories/project.repository.interface';
import { ProjectValidationService } from '../../domain/services/project-validation.service';
import { RollbackManager } from 'src/common/utils/rollbackManager';
import { ProjectTeamProvisionInputDTO } from '../dtos/request/create-project.dto';

@Injectable()
export class ProjectTeamProvisionService {
  constructor(
    @Inject(IProjectRepository)
    private readonly repo: IProjectRepository,
    private readonly validationService: ProjectValidationService,
  ) {}

  async resolve(
    input: ProjectTeamProvisionInputDTO,
    rollback: RollbackManager,
  ) {
    const project = await this.repo.addPersonel(input.projectId, input.userId)
    rollback.register(() =>
      this.repo.removePersonel(input.projectId, input.userId),
    );
    return project;
  }
}
