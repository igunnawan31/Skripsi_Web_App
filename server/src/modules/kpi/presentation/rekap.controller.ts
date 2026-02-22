import { Body, Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/common/guards/roles.guard";
import { GetAllIndikatorRekapUseCase } from "../application/use-cases/rekap/get.use-case";
import { LoggerService } from "src/modules/logger/logger.service";
import { RekapFilterDTO } from "../application/dtos/request/rekap/filter-rekap.dto";

@Controller('recaps')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class IndikatorRekapController {
  constructor(
    private readonly logger: LoggerService,
    private readonly getAllIndikatorRekapUseCase: GetAllIndikatorRekapUseCase,
  ) { }

  @Get()
  getAll(
    @Query() filters: RekapFilterDTO,
    @Body('userId') userId: string,
  ) {
    return this.getAllIndikatorRekapUseCase.execute(userId, filters);
  }
}
