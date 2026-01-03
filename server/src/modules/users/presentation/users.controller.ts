import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { IUserRepository } from '../domain/repositories/users.repository.interface';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { CreateUserDTO } from '../application/dtos/request/create-user.dto';
import { RolesMinor } from 'src/common/decorators/minor-role.decorator';
import { MinorRole } from '@prisma/client';
import { UserFilterDTO } from '../application/dtos/request/user-filter.dto';
import { UpdateUserDTO } from '../application/dtos/request/update-user.dto';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) { }

  @Post()
  @RolesMinor(MinorRole.HR)
  @UseInterceptors(
    FileInterceptor('userPhoto', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = './uploads/userPhoto';
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
    @Body() dto: CreateUserDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.createUserUseCase.execute({ ...dto, photo: file });
  }

  @Get()
  findAll(@Query() filters: UserFilterDTO) {
    return this.userRepo.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userRepo.findById(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('userPhoto', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = './uploads/userPhoto';
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
    @Body() dto: UpdateUserDTO,
    @Req() req: Request & { user: UserRequest },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.updateUserUseCase.execute(id, { ...dto, photo: file }, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request & { user: UserRequest }) {
    return this.deleteUserUseCase.execute(id, req.user.id);
  }
}
