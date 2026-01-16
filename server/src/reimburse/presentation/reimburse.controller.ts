import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { LoggerService } from 'src/logger/logger.service';
import { InternalUpdateReimburseDTO } from '../application/dtos/request/update.dto';
import {
  CreateReimburseDTO,
  InternalCreateReimburseDTO,
} from '../application/dtos/request/create.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { deleteFileArray } from 'src/common/utils/fileHelper';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { ApprovalReimburseUseCase } from '../application/use-cases/approval-reimburse.use-case';
import { SubmitReimburseUseCase } from '../application/use-cases/submit-reimburse.use-case';
import { GetReimburseUseCase } from '../application/use-cases/get-reimbuse.use-case';
import { GetAllReimburseUseCase } from '../application/use-cases/get-all-reimbuse.use-case';
import { ReimburseFilterDTO } from '../application/dtos/request/filter.dto';

@Controller('reimburses')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReimburseController {
  constructor(
    private readonly logger: LoggerService,
    private readonly approvalUseCase: ApprovalReimburseUseCase,
    private readonly submitUseCase: SubmitReimburseUseCase,
    private readonly getOneUseCase: GetReimburseUseCase,
    private readonly getAllUseCase: GetAllReimburseUseCase,
  ) {}
  @Get()
  findAll(
    @Query() filters: ReimburseFilterDTO,
    @Req() req: Request & { user: UserRequest },
  ) {
    console.log('Invoked');
    return this.getAllUseCase.execute(filters, req.user);
  }
  @Get(':id')
  findById(
    @Param('id') id: string,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.getOneUseCase.execute(id, req.user);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'reimburseDocuments', maxCount: 5 }], {
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
    }),
  )
  async create(
    @Req() req: Request & { user: UserRequest },
    @Body() dto: CreateReimburseDTO,
    @UploadedFiles()
    files: {
      reimburseDocuments: Express.Multer.File[];
    },
  ) {
    try {
      const payload: InternalCreateReimburseDTO = {
        ...dto,
        userId: req.user.id,
        documents: files.reimburseDocuments,
      };
      return this.submitUseCase.execute(payload);
    } catch (err) {
      deleteFileArray(files.reimburseDocuments, 'Dokumen reimburse');
      throw err;
    }
  }

  @Patch('/:id/approve')
  approve(
    @Param('id') id: string,
    @Req() req: Request & { user: UserRequest },
    @Body() dto: { notes: string },
  ) {
    const payload: InternalUpdateReimburseDTO = {
      approvalStatus: 'APPROVED',
      notes: dto.notes,
    };

    return this.approvalUseCase.execute(id, req.user, payload);
  }

  @Patch('/:id/reject')
  reject(
    @Param('id') id: string,
    @Req() req: Request & { user: UserRequest },
    @Body() dto: { notes: string },
  ) {
    const payload: InternalUpdateReimburseDTO = {
      approvalStatus: 'REJECTED',
      notes: dto.notes,
    };

    return this.approvalUseCase.execute(id, req.user, payload);
  }

  @Delete('/:id')
  delete() {}
}
