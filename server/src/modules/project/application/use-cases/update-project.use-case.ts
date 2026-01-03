import {
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import {
  deleteFileArray,
  deleteFileArrayString,
} from 'src/common/utils/fileHelper';
import { UpdateProjectResponseDTO } from '../dtos/response/update-response.dto';
import { InternalUpdateProjectDTO } from '../dtos/request/update-project.dto';
import { IProjectRepository } from '../../domain/repositories/project.repository.interface';

@Injectable()
export class UpdateProjectUseCase {
  constructor(
    @Inject(IProjectRepository)
    private readonly projectRepo: IProjectRepository,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async execute(
    projectId: string,
    dto: InternalUpdateProjectDTO,
    currentUser: UserRequest,
  ): Promise<UpdateProjectResponseDTO> {
    const project = await this.projectRepo.findById(projectId);
    if (!project) {
      if (dto.documents?.length) {
        await deleteFileArray(dto.documents, 'newProjectDocument');
      }
      throw new NotFoundException('Project tidak ditemukan');
    }
    const oldDocs = project.documents ?? [];
    const newDocs = dto.documents ?? [];
    const removeDocs = dto.removeDocuments ?? [];

    const validRemoveDocs = oldDocs
      .filter((d) => removeDocs.includes(d.path))
      .map((d) => d.path);

    let remainingDocs = oldDocs.filter(
      (d) => !validRemoveDocs.includes(d.path),
    );
    remainingDocs = [...remainingDocs, ...newDocs];

    try {
      const updated = await this.projectRepo.update(projectId, {
        name: dto.name,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
        documents: remainingDocs,
      });

      if (validRemoveDocs.length > 0) {
        await deleteFileArrayString(validRemoveDocs, 'removeProjectDocument');
      }

      return updated;
    } catch (e) {
      if (newDocs.length > 0) {
        await deleteFileArray(newDocs, 'newProjectDocument');
      }
      throw e;
    }

    // const updatedFields = Object.keys(dto);
    // this.eventEmitter.emit(
    //   'user.updated',
    //   new UserUpdatedEvent(userId, updatedFields, currentUser.id),
    // );
  }
}
