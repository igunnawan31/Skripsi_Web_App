import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { MajorRole, MinorRole } from 'src/generated/prisma/enums';
import { PrismaService } from '../database/prisma/prisma.service';
import { User } from 'src/generated/prisma/client';
import { MailService } from '../mail/application/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mailService: MailService,
  ) { }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw new UnauthorizedException('Email atau password salah');
      if (password) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new UnauthorizedException('Email atau password salah');
        }
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      majorRole: user.majorRole,
      minorRole: user.minorRole,
    };

    // Generate refresh token (long-lived)
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
    });

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        majorRole: user.majorRole,
        minorRole: user.minorRole,
      },
    };
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    minorRole: MinorRole;
  }) {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: { ...data, majorRole: MajorRole.KARYAWAN, password: hashed },
    });
    return this.login(user);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) return;

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await this.prisma.user.update({
      where: { email },
      data: {
        passwordResetOTP: otp,
        passwordResetExpiresAt: expiresAt,
      },
    });

    await this.mailService.sendOTPEmail(email, otp);
  }

  async verifyOtp(email: string, otp: string): Promise<{ valid: boolean }> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        passwordResetOTP: otp,
        passwordResetExpiresAt: { gt: new Date() },
      },
    });

    if (!user) throw new BadRequestException('Invalid or expired OTP');

    return { valid: true };
  }

  async resetPassword(
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        passwordResetOTP: otp,
        passwordResetExpiresAt: { gt: new Date() },
      },
    });

    if (!user) throw new BadRequestException('Invalid or expired OTP');

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(newPassword, 10),
        passwordResetOTP: null,
        passwordResetExpiresAt: null,
      },
    });
  }
}
