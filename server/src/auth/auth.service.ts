import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { MajorRole, MinorRole, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Email atau password salah');
    if (password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Email atau password salah');
      }
    }
    return user;
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
}
