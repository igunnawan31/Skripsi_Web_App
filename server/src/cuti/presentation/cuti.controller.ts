import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { SubmitCutiUseCase } from '../application/use-cases/submit-cuti.use-case';
import { ICutiRepository } from '../domain/repositories/cuti.repository.interface';
import { CreateCutiDTO } from '../application/dtos/request/create-cuti.dto';
import { UpdateCutiDTO } from '../application/dtos/request/update-cuti.dto';
import { ApproveCutiUseCase } from '../application/use-cases/approve-cuti.use-case';
import { CancelCutiUseCase } from '../application/use-cases/cancel-cuti.use-case';
import { RejectCutiUseCase } from '../application/use-cases/reject-cuti.use-case';
import { CutiFilterDTO } from '../application/dtos/request/filter-cuti.dto';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

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

  @Post()
  create(@Body() data: CreateCutiDTO, @Req() req: Request & { user: UserRequest }) {
    return this.submitCutiUseCase.execute(req.user.id, data);
  }

  @Get('pending')
  findAllPendingForApprover(@Req() req: Request & { user: UserRequest }, @Query() filters: CutiFilterDTO) {
    return this.cutiRepo.findPendingForApprover(req.user, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cutiRepo.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCutiDto: UpdateCutiDTO) {
    return this.cutiRepo.update(id, updateCutiDto);
  }

  @Patch('approve/:id')
  approval(@Param('id') id: string, @Body() data: UpdateCutiDTO, @Req() req: Request & { user: UserRequest }) {
    return this.ApproveCutiUseCase.execute(id, req.user.id, data)
  }
  @Patch('reject/:id')
  reject(@Param('id') id: string, @Body() data: UpdateCutiDTO, @Req() req: Request & { user: UserRequest }) {
    return this.RejectCutiUseCase.execute(id, req.user.id, data)
  }
  @Patch('cancel/:id')
  cancel(@Param('id') id: string, @Body() data: UpdateCutiDTO, @Req() req: Request & { user: UserRequest }) {
    return this.CancelCutiUseCase.execute(id, req.user.id, data)
  }

  @Delete(':id')
  Delete(@Param('id') id: string) {
    return this.cutiRepo.remove(id);
  }
}
