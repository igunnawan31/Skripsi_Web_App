import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/common/guards/roles.guard";
import { CreateJawabanUseCase } from "../application/use-cases/jawaban/create.use-case";
import { DeleteJawabanUseCase } from "../application/use-cases/jawaban/delete.use-case";
import { GetAllJawabanUseCase } from "../application/use-cases/jawaban/get-all.use-case";
import { GetJawabanUseCase } from "../application/use-cases/jawaban/get.use-case";
import { JawabanFilterDTO } from "../application/dtos/request/jawaban/filter-answer.dto";
import { UserRequest } from "src/common/types/UserRequest.dto";
import { CreateJawabanDTO } from "../application/dtos/request/jawaban/create-answer.dto";

@Controller('answers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class JawabanController {
  constructor(
    private readonly createJawabanUseCase: CreateJawabanUseCase,
    private readonly deleteJawabanUseCase: DeleteJawabanUseCase,
    private readonly getAllJawabanUseCase: GetAllJawabanUseCase,
    private readonly getJawabanUseCase: GetJawabanUseCase,
  ) {}

  @Get()
  getAll(@Query() filters: JawabanFilterDTO, @Req() req: Request & {user: UserRequest}) {
    return this.getAllJawabanUseCase.execute(filters, req.user);
  }
  @Get('/:id')
  getOne(@Param('id') id: string){
    return this.getJawabanUseCase.execute(id);
  }
  @Post()
  create(@Body() dto: CreateJawabanDTO[], @Req() req: Request & {user: UserRequest}){
    return this.createJawabanUseCase.execute(dto, req.user);
  }
  @Delete('/:id')
  delete(@Param('id') id: string){
    return this.deleteJawabanUseCase.execute(id);
  }
}
