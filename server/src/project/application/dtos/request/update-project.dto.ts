import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDTO } from './create-project.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ProjectStatus } from '@prisma/client';

export class UpdateProjectDTO extends PartialType(CreateProjectDTO) {
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;
}
