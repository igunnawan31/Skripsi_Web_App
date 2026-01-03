import {
  Controller,
  Get,
  Res,
  NotFoundException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { FilesService } from './files.service';

@Controller('files')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @Get()
  async getFile(
    @Query('path') filePath: string,
    @Res() res: Response,
  ): Promise<void> {
    const fullPath = await this.filesService.getFileByPath(filePath);
    if (!fullPath) throw new NotFoundException('File not found');

    res.sendFile(fullPath);
  }
}

