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
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { SubmitCutiUseCase } from '../application/use-cases/submit-cuti.use-case';
import { ICutiRepository } from '../domain/repositories/cuti.repository.interface';
import { CreateCutiDTO } from '../application/dtos/request/create-cuti.dto';
import { ApproveCutiUseCase } from '../application/use-cases/approve-cuti.use-case';
import { CancelCutiUseCase } from '../application/use-cases/cancel-cuti.use-case';
import { RejectCutiUseCase } from '../application/use-cases/reject-cuti.use-case';
import { CutiFilterDTO } from '../application/dtos/request/filter-cuti.dto';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { MajorRole, MinorRole } from '@prisma/client';
import { RolesMinor } from 'src/common/decorators/minor-role.decorator';
import { ApprovalCutiDTO } from '../application/dtos/request/approval.dto';
import { RolesMajor } from 'src/common/decorators/major-roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { UpdateCutiDTO } from '../application/dtos/request/update-cuti.dto';

@Controller('cuti')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CutiController {
  constructor(
    private readonly cutiRepo: ICutiRepository,
    private readonly submitCutiUseCase: SubmitCutiUseCase,
    private readonly ApproveCutiUseCase: ApproveCutiUseCase,
    private readonly CancelCutiUseCase: CancelCutiUseCase,
    private readonly RejectCutiUseCase: RejectCutiUseCase,
  ) { }

  // POST cuti/
  @Post()
  @UseInterceptors(
    FileInterceptor('dokumenCuti', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = './uploads/dokumenCuti';
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
  create(
    @Body() data: CreateCutiDTO,
    @Req() req: Request & { user: UserRequest },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.submitCutiUseCase.execute(req.user.id, data, file);
  }

  // GET cuti/
  @Get()
  findAll(
    @Req() req: Request & { user: UserRequest },
    @Query() filters: CutiFilterDTO,
  ) {
    return this.cutiRepo.findAll(req.user, filters);
  }

  // GET cuti/team
  @Get('team')
  @RolesMinor(MinorRole.PROJECT_MANAGER)
  findTeamCuti(
    @Req() req: Request & { user: UserRequest },
    @Query() filters: CutiFilterDTO,
  ) {
    return this.cutiRepo.findTeamCuti(req.user, filters);
  }

  // GET cuti/user/:id
  @Get('user/:id')
  @RolesMinor(MinorRole.HR)
  findByUserId(
    @Req() req: Request & { user: UserRequest },
    @Param('id') targetId: string,
    @Query() filters: CutiFilterDTO,
  ) {
    return this.cutiRepo.findByUserId(targetId, filters);
  }

  // GET cuti/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cutiRepo.findById(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('dokumenCuti', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = './uploads/dokumenCuti';
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
  update(
    @Param('id') id: string,
    @Body() updateCutiDto: UpdateCutiDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.cutiRepo.update(id, updateCutiDto, file);
  }

  // PATCH cuti/approve/:id
  @Patch('approve/:id')
  @RolesMinor(MinorRole.HR)
  approval(
    @Param('id') id: string,
    @Body() data: ApprovalCutiDTO,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.ApproveCutiUseCase.execute(id, req.user.id, data);
  }

  // PATCH cuti/reject/:id
  @Patch('reject/:id')
  @RolesMinor(MinorRole.HR)
  reject(
    @Param('id') id: string,
    @Body() data: ApprovalCutiDTO,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.RejectCutiUseCase.execute(id, req.user.id, data);
  }

  // PATCH cuti/cancel/:id
  @Patch('cancel/:id')
  @RolesMajor(MajorRole.KARYAWAN)
  cancel(
    @Param('id') id: string,
    @Body() data: ApprovalCutiDTO,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.CancelCutiUseCase.execute(id, req.user.id, data);
  }

  // DELETE cuti/:id
  @Delete(':id')
  Delete(@Param('id') id: string) {
    return this.cutiRepo.remove(id);
  }
}
