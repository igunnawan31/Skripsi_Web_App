import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggedInGuard } from './common/guards/logged-in.guard';
import type { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  publicRoute() {
    return this.appService.getPublic();
  }

  @UseGuards(LoggedInGuard)
  @Get('protected')
  guardedRoute(@Req() req: Request) {
    console.log(typeof req.session.passport!.user.majorRole);
    return this.appService.getPrivate();
  }
}
