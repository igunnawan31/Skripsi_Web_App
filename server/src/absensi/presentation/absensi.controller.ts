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

@Controller('absensi')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AbsensiController {
  constructor(
    private readonly absensiRepo: IAbsensiRepository,
    private readonly checkInUseCase: CheckInUseCase,
    private readonly checkOutUseCase: CheckOutUseCase,
  ) { }

  @Post()
  checkIn(@Body() data: CheckInDTO) {
    return this.checkInUseCase.execute(data.userId, data);
  }

  @Get('/:id')
  findByUserId(@Req() req: Request & {user: UserRequest}, @Param('id') id: string, @Query() filters: AbsensiFilterDTO ) {
    if (req.user.id !== id && req.user.minorRole !== MinorRole.HR){
      throw new UnauthorizedException('User tidak memiliki akses data ini')
    }
    return this.absensiRepo.findByMonth(id, filters.year, filters.month, filters);
  }

  @Patch(':id')
  checkOut(@Param('id') id: string) {
    return this.checkOutUseCase.execute(id);
  }
}
