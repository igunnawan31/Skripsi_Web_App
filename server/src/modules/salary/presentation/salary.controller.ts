import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { MinorRole } from '@prisma/client';
import { RolesMinor } from 'src/common/decorators/minor-role.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { ISalaryRepository } from '../domain/repositories/salary.repository.interface';
import { SalaryFilterDTO } from '../application/dtos/request/salary-filter.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { deleteFileArray } from 'src/common/utils/fileHelper';
import { PaySalaryUseCase } from '../application/use-cases/pay-salary.use-case';
import { GetAllSalariesUseCase } from '../application/use-cases/get-all-salary.use-cases';
import { GetSalaryUseCase } from '../application/use-cases/get-salary.use-case';
import { GetUserSalariesUseCase } from '../application/use-cases/get-user-salary.use-case';
import { UserRequest } from 'src/common/types/UserRequest.dto';

@Controller('salaries')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SalaryController {
  constructor(
    private readonly gajiRepo: ISalaryRepository,
    private readonly paySalaryUseCase: PaySalaryUseCase,
    private readonly getAllSalaryUseCase: GetAllSalariesUseCase,
    private readonly getSalaryUseCase: GetSalaryUseCase,
    private readonly getUserSalaryUseCase: GetUserSalariesUseCase,
  ) { }

  // implement nanti kalau ada case gaji untuk non kontrak
  // @Post()
  // create(@Body() createGajiDto: CreateGajiDto) {
  //   return this.gajiService.create(createGajiDto);
  // }

  @Get()
  findAll(
    @Query() filters: SalaryFilterDTO,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.getAllSalaryUseCase.execute(filters, req.user);
  }

  @Get('/users/:id')
  findByUserId(
    @Param('id') id: string,
    @Query() filters: SalaryFilterDTO,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.getUserSalaryUseCase.execute(id, filters, req.user);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.getSalaryUseCase.execute(id, req.user);
  }

  @Patch('/:id/pay')
  @RolesMinor(MinorRole.HR)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'paychecks', maxCount: 5 }], {
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
  paySalary(
    @Param('id') id: string,
    @UploadedFiles() files: { paychecks: Express.Multer.File[] },
    @Req() req: Request & { user: UserRequest },
  ) {
    try {
      const { paychecks } = files;
      return this.paySalaryUseCase.execute(id, paychecks, req.user);
    } catch (err) {
      deleteFileArray(files.paychecks, 'Salary paycheck');
      throw err;
    }
  }

  // @Patch(':id')
  // @RolesMinor(MinorRole.HR)
  // update(@Param('id') id: string, @Body() updateSalaryDto: UpdateSalaryDTO) {
  //   return this.gajiRepo.update(id, updateSalaryDto);
  // }

  @Delete(':id')
  @RolesMinor(MinorRole.HR)
  remove(@Param('id') id: string) {
    return this.gajiRepo.remove(id);
  }
}
