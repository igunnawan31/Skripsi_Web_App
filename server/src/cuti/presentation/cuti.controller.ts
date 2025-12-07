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

@Controller('cuti')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CutiController {
  constructor(
    private readonly cutiRepo: ICutiRepository,
    private readonly submitCutiUseCase: SubmitCutiUseCase,
    private readonly ApproveCutiUseCase: ApproveCutiUseCase,
    private readonly CancelCutiUseCase: CancelCutiUseCase,
    private readonly RejectCutiUseCase: RejectCutiUseCase,
  ) {}

  // POST cuti/
  @Post()
  create(
    @Body() data: CreateCutiDTO,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.submitCutiUseCase.execute(req.user.id, data);
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

  // GET cuti/pending
  @Get('pending')
  @RolesMinor(MinorRole.HR)
  findAllPendingForApprover(
    @Req() req: Request & { user: UserRequest },
    @Query() filters: CutiFilterDTO,
  ) {
    return this.cutiRepo.findPendingForApprover(req.user, filters);
  }

  // GET cuti/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cutiRepo.findById(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCutiDto: UpdateCutiDTO) {
  //   return this.cutiRepo.update(id, updateCutiDto);
  // }

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
