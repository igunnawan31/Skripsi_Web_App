import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { CreateKontrakUseCase } from '../application/use-cases/create-kontrak.use-case';
import { GetUserQuotaUseCase } from '../application/use-cases/get-user-quota.use-cases';
import { MinorRole } from '@prisma/client';
import { RolesMinor } from 'src/common/decorators/minor-role.decorator';
import {
  CreateKontrakDTO,
  InternalCreateKontrakDTO,
} from '../application/dtos/request/create-kontrak.dto';
import { KontrakFilterDTO } from '../application/dtos/request/kontrak-filter.dto';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { KontrakValidationService } from '../domain/services/kontrak-validation.service';
import { DeleteKontrakUseCase } from '../application/use-cases/delete-kontrak.use-case';
import { GetKontrakUseCase } from '../application/use-cases/get-kontrak.use-case';
import { GetAllKontrakUseCase } from '../application/use-cases/getAll-kontrak.use-case';
import { GetUserKontrakUseCase } from '../application/use-cases/get-user-kontrak.use-case';
import { deleteFileArray } from 'src/common/utils/fileHelper';
import {
  InternalUpdateKontrakDTO,
  UpdateKontrakDTO,
} from '../application/dtos/request/update-kontrak.dto';
import { UpdateKontrakUseCase } from '../application/use-cases/update-kontrak.use-case';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Controller('kontrak')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class KontrakController {
  constructor(
    private readonly createKontrakUseCase: CreateKontrakUseCase,
    private readonly deleteKontrakUseCase: DeleteKontrakUseCase,
    private readonly getKontrakUseCase: GetKontrakUseCase,
    private readonly getAllKontrakUseCase: GetAllKontrakUseCase,
    private readonly getUserKontrakUseCase: GetUserKontrakUseCase,
    private readonly updateKontrakUseCase: UpdateKontrakUseCase,
    private readonly getUserQuotaUseCase: GetUserQuotaUseCase,
    private readonly validationService: KontrakValidationService,
  ) { }

  @Post()
  @RolesMinor(MinorRole.HR)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'userPhoto', maxCount: 1 },
        { name: 'projectDocuments', maxCount: 5 },
        { name: 'contractDocuments', maxCount: 5 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const folder = `./uploads/${file.fieldname}`;
            if (!fs.existsSync(folder)) {
              fs.mkdirSync(folder, { recursive: true });
            }
            cb(null, folder);
          },
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(
              null,
              `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
            );
          },
        }),
      },
    ),
  )
  async createKontrak(
    @Body() dto: CreateKontrakDTO,
    @Req() req: Request & { user: UserRequest },
    @UploadedFiles()
    files: {
      contractDocuments: Express.Multer.File[];
      userPhoto?: Express.Multer.File[];
      projectDocuments?: Express.Multer.File[];
    },
  ) {
    try {
      const { userPhoto, projectDocuments, contractDocuments } = files;
      if (!contractDocuments?.length) {
        throw new BadRequestException('Dokumen kontrak wajib ada');
      }

      const payload: InternalCreateKontrakDTO = {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        userData: {
          ...dto.userData,
          photo: userPhoto ? userPhoto[0] : undefined,
        },
        projectData: dto.projectData
          ? {
            ...dto.projectData,
            startDate: new Date(dto.projectData.startDate),
            endDate: new Date(dto.projectData.endDate),
            documents: projectDocuments,
          }
          : undefined,
        documents: contractDocuments,
      };
      return await this.createKontrakUseCase.execute(payload, req.user.id);
    } catch (err) {
      deleteFileArray(files.contractDocuments, 'Dokumen kontrak');
      if (files.userPhoto) deleteFileArray(files.userPhoto, 'Foto user');
      if (files.projectDocuments)
        deleteFileArray(files.projectDocuments, 'Dokumen proyek');
      throw err;
    }
  }

  @Get()
  @RolesMinor(MinorRole.HR)
  findAll(@Query() filters: KontrakFilterDTO) {
    return this.getAllKontrakUseCase.execute(filters);
  }

  @Get('/:id')
  findOne(
    @Param('id') kontrakId: string,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.getKontrakUseCase.execute(kontrakId);
  }

  @Get('user/:userId')
  getUserKontraks(
    @Param('userId') userId: string,
    @Query() filters: KontrakFilterDTO,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.getUserKontrakUseCase.execute(userId, filters, req.user);
  }

  @Get('user/:userId/quota')
  getUserQuota(
    @Param('userId') userId: string,
    @Query('year') year?: number,
    @Query('month') month?: number,
  ) {
    return this.getUserQuotaUseCase.execute(
      userId,
      year ? parseInt(year.toString()) : undefined,
      month ? parseInt(month.toString()) : undefined,
    );
  }

  @Patch('/:kontrakId')
  @RolesMinor(MinorRole.HR)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'userPhoto', maxCount: 1 },
        { name: 'projectDocuments', maxCount: 5 },
        { name: 'contractDocuments', maxCount: 5 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const folder = `./uploads/${file.fieldname}`;
            if (!fs.existsSync(folder)) {
              fs.mkdirSync(folder, { recursive: true });
            }
            cb(null, folder);
          },
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(
              null,
              `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
            );
          },
        }),
      },
    ),
  )
  async patch(
    @Param('kontrakId') kontrakId: string,
    @Body() dto: UpdateKontrakDTO,
    @Req() req: Request & { user: UserRequest },
    @UploadedFiles()
    files: {
      contractDocuments: Express.Multer.File[];
    },
  ) {
    try {
      const payload: InternalUpdateKontrakDTO = {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        documents: files.contractDocuments,
      };
      return this.updateKontrakUseCase.execute(kontrakId, payload, req.user);
    } catch (err) {
      throw err;
    }
  }

  @Delete('/:kontrakId')
  @RolesMinor(MinorRole.HR)
  delete(@Param('kontrakId') kontrakId: string) {
    return this.deleteKontrakUseCase.execute(kontrakId);
  }
}
