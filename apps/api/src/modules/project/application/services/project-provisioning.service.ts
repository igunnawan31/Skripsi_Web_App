import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectProvisionInputDTO } from '../dtos/request/create-project.dto';
import { RollbackManager } from 'src/common/utils/rollbackManager';
import { deleteFileArray } from 'src/common/utils/fileHelper';
import { IProjectRepository } from '../../domain/repositories/project.repository.interface';
import { ProjectValidationService } from '../../domain/services/project-validation.service';

@Injectable()
export class ProjectProvisionService {
  constructor(
    @Inject(IProjectRepository)
    private readonly repo: IProjectRepository,
    private readonly validationService: ProjectValidationService,
  ) { }

  async resolve(input: ProjectProvisionInputDTO, rollback: RollbackManager) {
    if (input.id) {
      // Delete sent documents since existing project is used
      if (input.documents) {
        await deleteFileArray(input.documents, 'Dokumen proyek');
      }
      // Existing Project
      const project = await this.repo.findById(input.id);
      if (!project) {
        throw new NotFoundException('Project tidak ditemukan');
      }
      return project;
    }

    const validation = this.validationService.validateDates(
      input.startDate,
      input.endDate,
    );

    if (!validation.valid) {
      throw new BadRequestException(`Project data: ${validation.message}`);
    }

    const project = await this.repo.create({
      name: input.name,
      description: input.description,
      startDate: input.startDate,
      endDate: input.endDate,
      documents: input.documents,
    });
    rollback.register(() => this.repo.remove(project.id));
    return project;
  }
}
