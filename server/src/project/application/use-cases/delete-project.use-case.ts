import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { deleteFileArray } from 'src/common/utils/fileHelper';
import { IProjectRepository } from 'src/project/domain/repositories/project.repository.interface';

@Injectable()
export class DeleteProjectUseCase {
  constructor(
    @Inject(IProjectRepository)
    private readonly projectRepo: IProjectRepository,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async execute(projectId: string, deletedBy: string): Promise<void> {
    const project = await this.projectRepo.findById(projectId);
    if (!project) {
      throw new NotFoundException('User tidak ditemukan');
    }

    if (project.documents.length > 0) {
      await deleteFileArray(project.documents, 'projectDocument');
    }
    try {
      const deletedProject = await this.projectRepo.remove(projectId);
      this.eventEmitter.emit('project.deleted', deletedProject);
    } catch (err) {
      throw err;
    }
  }
}
