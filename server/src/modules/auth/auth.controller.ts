import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload.type';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma/prisma.service';
import { LoggerService } from '../logger/logger.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}
  private readonly logger: LoggerService;

  // auth/login
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }

  // auth/register
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // auth/refresh
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: { refreshToken: string }) {
    try {
      // Verify refresh token
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        body.refreshToken,
        {
          secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        },
      );

      // Optional: Check if user still exists & is active
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Issue new access token
      const newAccessToken = await this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          majorRole: user.majorRole,
          minorRole: user.minorRole,
        },
        {
          expiresIn: '7d',
        },
      );

      // Optional: Rotate refresh token (more secure)
      const newRefreshToken = await this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          majorRole: user.majorRole,
          minorRole: user.minorRole,
        },
        {
          expiresIn: '7d',
          secret:
            this.config.get<string>('JWT_REFRESH_SECRET') ||
            this.config.get<string>('JWT_SECRET'),
        },
      );

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}

