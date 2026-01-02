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
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { IAbsensiRepository } from '../domain/repositories/absensi.repository.interface';
import { CheckInDTO } from '../application/dtos/request/check-in.dto';
import { CheckInUseCase } from '../application/use-cases/check-in.use-case';
import { CheckOutUseCase } from '../application/use-cases/check-out.use-case.dto';
import { AbsensiFilterDTO } from '../application/dtos/request/absensi-filter.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { MinorRole } from '@prisma/client';
import { RolesMinor } from 'src/common/decorators/minor-role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Controller('absensi')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AbsensiController {
  constructor(
    private readonly absensiRepo: IAbsensiRepository,
    private readonly checkInUseCase: CheckInUseCase,
    private readonly checkOutUseCase: CheckOutUseCase,
  ) { }

  // POST absensi/
  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = `./uploads/absensi`;
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
            `checkInPhoto-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  checkIn(@Body() data: CheckInDTO, @UploadedFile() file: Express.Multer.File) {
    return this.checkInUseCase.execute(data.userId, {
      ...data,
      photo: file,
    });
  }

  // GET absensi/
  @Get()
  @RolesMinor(MinorRole.HR)
  findAllOneDay(@Query() filters: AbsensiFilterDTO) {
    return this.absensiRepo.findAllOneDay(filters);
  }

  // GET absensi/:id
  @Get('/:id')
  findByUserId(
    @Req() req: Request & { user: UserRequest },
    @Param('id') id: string,
    @Query() filters: AbsensiFilterDTO,
  ) {
    if (req.user.id !== id && req.user.minorRole !== MinorRole.HR) {
      throw new UnauthorizedException('User tidak memiliki akses data ini');
    }
    return this.absensiRepo.findByMonth(
      id,
      filters.year,
      filters.month,
      filters,
    );
  }

  @Get('/single/:id')
  findById(
    @Req() req: Request & { user: UserRequest },
    @Param('id') id: string,
    @Query('date') date: string,
  ) {
    if (req.user.id !== id && req.user.minorRole !== MinorRole.HR) {
      throw new UnauthorizedException('User tidak memiliki akses data ini');
    }
    if (!date) {
      throw new BadRequestException('Date harus diisi');
    }
    const today = new Date();
    console.log("Today: ", today);
    console.log("Date: ", new Date(date));
    return this.absensiRepo.findOne(id, new Date(date));
  }

  // PATCH absensi/:id
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = `./uploads/absensi`;
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
            `checkOutPhoto-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  checkOut(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.checkOutUseCase.execute(id, file);
  }
}
