import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { LoggerService } from 'src/modules/logger/logger.service';
import { CreateIndikatorUseCase } from '../application/use-cases/indikator/create.use-case';
import { DeleteIndikatorUseCase } from '../application/use-cases/indikator/delete.use-case';
import { GetAllIndikatorUseCase } from '../application/use-cases/indikator/get-all.use-case';
import { GetIndikatorUseCase } from '../application/use-cases/indikator/get.use-case';
import { UpdateIndikatorUseCase } from '../application/use-cases/indikator/update.use-case';
import { IndikatorFilterDTO } from '../application/dtos/request/indikator/filter-indicator.dto';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { CreateIndikatorDTO } from '../application/dtos/request/indikator/create-indicator.dto';
import { UpdateIndikatorDTO } from '../application/dtos/request/indikator/update-indicator.dto';

@Controller('indicators')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class IndicatorController {
  constructor(
    private readonly logger: LoggerService,
    private readonly createIndicatorUseCase: CreateIndikatorUseCase,
    private readonly deleteIndicatorUseCase: DeleteIndikatorUseCase,
    private readonly getAllIndicatorUseCase: GetAllIndikatorUseCase,
    private readonly getIndicatorUseCase: GetIndikatorUseCase,
    private readonly updateIndicatorUseCase: UpdateIndikatorUseCase,
  ) { }

  @Get()
  getAll(@Query() filters: IndikatorFilterDTO, @Req() req: Request & { user: UserRequest }) {
    return this.getAllIndicatorUseCase.execute(filters, req.user);
  }
  @Get('/:id')
  getOne(@Param('id') id: string, @Req() req: Request & { user: UserRequest }) {
    return this.getIndicatorUseCase.execute(id)
  }
  @Post()
  create(@Body() dto: CreateIndikatorDTO, @Req() req: Request & { user: UserRequest }) {
    return this.createIndicatorUseCase.execute(dto, req.user)
  }
  @Patch('/:id')
  update(@Param('id') id: string, @Body() dto: UpdateIndikatorDTO) {
    return this.updateIndicatorUseCase.execute(id, dto);
  }
  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.deleteIndicatorUseCase.execute(id);
  }
}
