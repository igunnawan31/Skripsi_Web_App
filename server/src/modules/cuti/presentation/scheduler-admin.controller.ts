import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CutiExpirationScheduler } from "../infrastructure/scheduler/cuti-expiration.scheduler";
import { RolesGuard } from "src/common/guards/roles.guard";
import { AuthGuard } from "@nestjs/passport";

@Controller('admin/scheduler')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SchedulerAdminController {
  constructor(private readonly scheduler: CutiExpirationScheduler) {}

  @Post('cuti-expiration/trigger')
  async triggerNow() {
    return this.scheduler.triggerManually();
  }

  @Get('cuti-expiration/preview')
  async preview() {
    return this.scheduler.previewExpiring();
  }

  @Get('cuti-expiration/info')
  getInfo() {
    return this.scheduler.getSchedulerInfo();
  }
}
