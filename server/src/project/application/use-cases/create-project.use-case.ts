import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IProjectRepository } from 'src/project/domain/repositories/project.repository.interface';
import { ProjectValidationService } from 'src/project/domain/services/project-validation.service';
import { InternalCreateProjectDTO } from '../dtos/request/create-project.dto';
import { CreateProjectResponseDTO } from '../dtos/response/create-response.dto';
import { deleteFileArray } from 'src/common/utils/fileHelper';
import { FileMetaData } from 'src/common/types/FileMetaData.dto';

@Injectable()
export class CreateProjectUseCase {
  constructor(
    @Inject(IProjectRepository)
    private readonly projectRepo: IProjectRepository,
    private readonly projectValidationService: ProjectValidationService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async execute(
    dto: InternalCreateProjectDTO,
  ): Promise<CreateProjectResponseDTO> {
    const validation = this.projectValidationService.validateDates(
      new Date(dto.startDate),
      new Date(dto.endDate),
    );

    if (!validation.valid) {
      throw new BadRequestException(validation.message);
    }

    let projectDocument: FileMetaData[] = [];

    try {
      projectDocument = dto.dokumen ?? [];
      console.log(projectDocument);
      const project = await this.projectRepo.create({
        name: dto.name,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
        dokumen: projectDocument,
      });

      this.eventEmitter.emit('project.created', project);
      return project;
    } catch (err) {
      if (dto.dokumen && dto.dokumen.length > 0) {
        await deleteFileArray(dto.dokumen, 'projectDocument');
      }
      throw err;
    }
  }
}
