import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { LoggerService } from "src/modules/logger/logger.service";
import { AgendaFilterDTO } from "../application/dtos/request/filter.dto";
import { GetAllAgendaUseCase } from "../application/use-cases/get-all-agenda.use-case";
import { GetAllOccurrencesUseCase } from "../application/use-cases/get-all-occurrences.use-case";
import { GetAgendaUseCase } from "../application/use-cases/get-agenda.use-case";
import { CreateAgendaUseCase } from "../application/use-cases/create.use-case";
import { UpdateAgendaUseCase } from "../application/use-cases/update-agenda.use-case";
import { UpdateAgendaOccurrenceUseCase } from "../application/use-cases/update-occurrences.use-case";
import { UserRequest } from "src/common/types/UserRequest.dto";
import { RolesGuard } from "src/common/guards/roles.guard";
import { AuthGuard } from "@nestjs/passport";
import { DateUtilService } from "src/common/utils/dateUtil";
import { CreateAgendaDTO, InternalCreateAgendaDTO } from "../application/dtos/request/create.dto";
import { InternalUpdateAgendaDTO, InternalUpdateAgendaOccurrenceDTO, UpdateAgendaDTO, UpdateAgendaOccurrenceDTO } from "../application/dtos/request/update.dto";
import { DeleteAgendaUseCase } from "../application/use-cases/delete-agenda.use-case";

@Controller('agendas')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AgendasController {
  constructor(
    private readonly logger: LoggerService,
    private readonly dateUtil: DateUtilService,
    private readonly getAllAgendaUseCase: GetAllAgendaUseCase,
    private readonly getAllOccurrenceUseCase: GetAllOccurrencesUseCase,
    private readonly getAgendaUseCase: GetAgendaUseCase,
    private readonly createAgendaUseCase: CreateAgendaUseCase,
    private readonly updateAgendaUseCase: UpdateAgendaUseCase,
    private readonly updateOccurrenceUseCase: UpdateAgendaOccurrenceUseCase,
    private readonly deleteAgendaUseCase: DeleteAgendaUseCase,
  ) { }

  @Get()
  getAllAgenda(@Query() filters: AgendaFilterDTO, @Req() req: Request & { user: UserRequest }) {
    return this.getAllAgendaUseCase.execute(filters, req.user);
  }
  @Get('/occurrences')
  getAllOccurrences(@Query('date') date: string) {
    const formattedDate = this.dateUtil.parseDate(date);
    return this.getAllOccurrenceUseCase.execute(formattedDate)
  }
  @Get('/:id')
  getAgenda(@Param('id') id: string, @Req() req: Request & { user: UserRequest }) {
    return this.getAgendaUseCase.execute(id, req.user);
  }
  @Post()
  createAgenda(@Body() dto: CreateAgendaDTO){
    return this.createAgendaUseCase.execute(dto);
  }
  @Patch('/:id')
  updateAgenda(@Param('id') id: string, @Body() dto: UpdateAgendaDTO){
    let formattedDate: Date | undefined = undefined;
    if (dto.eventDate){
      formattedDate = this.dateUtil.parseDate(dto.eventDate);
    }
    const payload: InternalUpdateAgendaDTO = {
      ...dto,
      eventDate: formattedDate ?? undefined,
    }
    return this.updateAgendaUseCase.execute(id, payload)
  }
  @Patch('/occurrences/:id')
  updateOccurrence(@Param('id') id: string, @Body() dto: UpdateAgendaOccurrenceDTO) {
    let formattedDate: Date | undefined = undefined;
    if (dto.date){
      formattedDate = this.dateUtil.parseDate(dto.date);
    }
    const payload: InternalUpdateAgendaOccurrenceDTO= {
      ...dto,
      date: formattedDate ?? undefined,
    }
    return this.updateOccurrenceUseCase.execute(id, payload)
  }
  @Delete('/:id')
  removeAgenda(@Param('id') id: string, @Req() req: Request & {user: UserRequest}){
    return this.deleteAgendaUseCase.execute(id, req.user);
  }
}
