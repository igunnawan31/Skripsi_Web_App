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
} from '@nestjs/common';
import { IKontrakRepository } from '../domain/repositories/kontrak.repository.interface';
import { CreateKontrakUseCase } from '../application/use-cases/create-kontrak.use-case';
import { GetUserQuotaUseCase } from '../application/use-cases/get-user-quota.use-cases';
import { MajorRole, MinorRole } from '@prisma/client';
import { RolesMajor } from 'src/common/decorators/major-roles.decorator';
import { RolesMinor } from 'src/common/decorators/minor-role.decorator';
import { CreateKontrakDTO } from '../application/dtos/request/create-kontrak.dto';
import { KontrakFilterDTO } from '../application/dtos/request/kontrak-filter.dto';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
@Controller('kontrak')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class KontrakController {
  constructor(
    private readonly kontrakRepo: IKontrakRepository,
    private readonly createKontrakUseCase: CreateKontrakUseCase,
    private readonly getUserQuotaUseCase: GetUserQuotaUseCase,
  ) { }

  @Post()
  @RolesMinor(MinorRole.HR)
  async createKontrak(
    @Body() dto: CreateKontrakDTO,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.createKontrakUseCase.execute(dto, req.user.id);
  }

  @Get('user/:userId')
  async getUserKontraks(@Param('userId') userId: string, @Query() filters: KontrakFilterDTO) {
    return this.kontrakRepo.findByUserId(userId, filters);
  }

  @Get('user/:userId/quota')
  async getUserQuota(
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
}
