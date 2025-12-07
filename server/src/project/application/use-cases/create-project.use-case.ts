import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IProjectRepository } from 'src/project/domain/repositories/project.repository.interface';
import { ProjectValidationService } from 'src/project/domain/services/project-validation.service';
import { CreateProjectDTO } from '../dtos/request/create-project.dto';
import { CreateProjectResponseDTO } from '../dtos/response/create-response.dto';

@Injectable()
export class CreateProjectUseCase {
  constructor(
    @Inject(IProjectRepository)
    private readonly projectRepo: IProjectRepository,
    private readonly projectValidationService: ProjectValidationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: CreateProjectDTO): Promise<CreateProjectResponseDTO> {
    const validation = this.projectValidationService.validateDates(
      new Date(dto.startDate),
      new Date(dto.endDate),
    );

    if (!validation.valid) {
      throw new BadRequestException(validation.message);
    }

    const project = await this.projectRepo.create({
      name: dto.name,
      description: dto.description,
      startDate: dto.startDate,
      endDate: dto.endDate,
    });

    // this.eventEmitter.emit(
    //   'cuti.submitted',
    //   new CutiSubmittedEvent(
    //     cuti.id,
    //     userId,
    //     user.name,
    //     formattedStartDate,
    //     formattedEndDate,
    //   ),
    // );

    return project;
  }
}
