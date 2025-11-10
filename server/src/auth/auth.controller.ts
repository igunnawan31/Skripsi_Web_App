import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoggerService } from 'src/logger/logger.service';
import type { Request } from 'express';
import { LocalGuard } from 'src/common/guards/local.guard';
import { ValidateResponse } from './dto/response/validation-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger: LoggerService;

  @UseGuards(LocalGuard)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request & { user: ValidateResponse },
  ) {
    const user = req.user;
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user, req.sessionID);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: { refreshToken: string }) {
    try {
      return;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
