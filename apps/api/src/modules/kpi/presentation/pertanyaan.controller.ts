import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreatePertanyaanUseCase } from '../application/use-cases/pertanyaan/create.use-case';
import { DeletePertanyaanUseCase } from '../application/use-cases/pertanyaan/delete.use-case';
import { GetAllPertanyaanUseCase } from '../application/use-cases/pertanyaan/get-all.use-case';
import { GetPertanyaanUseCase } from '../application/use-cases/pertanyaan/get.use-case';
import { UpdatePertanyaanUseCase } from '../application/use-cases/pertanyaan/update.use-case';
import { PertanyaanFilterDTO } from '../application/dtos/request/pertanyaan/filter-question.dto';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { CreatePertanyaanDTO } from '../application/dtos/request/pertanyaan/create-question.dto';
import { UpdatePertanyaanDTO } from '../application/dtos/request/pertanyaan/update-question.dto';

@Controller('questions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PertanyaanController {
  constructor(
    private readonly createPertanyaanUseCase: CreatePertanyaanUseCase,
    private readonly deletePertanyaanUseCase: DeletePertanyaanUseCase,
    private readonly getAllPertanyaanUseCase: GetAllPertanyaanUseCase,
    private readonly getPertanyaanUseCase: GetPertanyaanUseCase,
    private readonly updatePertanyaanUseCase: UpdatePertanyaanUseCase,
  ) { }

  @Get()
  getAll(
    @Query() filters: PertanyaanFilterDTO,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.getAllPertanyaanUseCase.execute(filters, req.user);
  }
  @Get('/:id')
  getOne(@Param('id') id: string) {
    return this.getPertanyaanUseCase.execute(id);
  }
  @Post()
  create(
    @Body() dto: CreatePertanyaanDTO[],
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.createPertanyaanUseCase.execute(dto, req.user);
  }
  @Patch('/:id')
  update(@Param('id') id: string, @Body() dto: UpdatePertanyaanDTO) {
    return this.updatePertanyaanUseCase.execute(id, dto);
  }
  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.deletePertanyaanUseCase.execute(id);
  }
}
