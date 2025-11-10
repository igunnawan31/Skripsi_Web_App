import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { ValidateResponse } from './dto/response/validation-response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private users: User[] = [
    {
      id: 'Joe1',
      name: 'Joe',
      email: 'joefoo@test.com',
      // P4ssword!
      password: '$2b$12$s50omJrK/N3yCM6ynZYmNeen9WERDIVTncywePc75.Ul8.9PUk0LK',
      majorRole: 'OWNER',
      minorRole: 'HR',
      branchId: 'Jkt',
    },
    {
      id: 'Jen2',
      name: 'Jen',
      email: 'jenbar@test.com',
      // P4ssword!
      password: '$2b$12$FHUV7sHexgNoBbP8HsD4Su/CeiWbuX/JCo8l2nlY1yCo2LcR3SjmC',
      majorRole: 'KARYAWAN',
      minorRole: 'HR',
      branchId: 'Jkt',
    },
  ];

  async validateUser(email: string, password: string) {
    // const user = await this.prisma.user.findUnique({ where: { email } });
    const user = this.users.find((u) => u.email === email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (password) {
      if (!user.password) {
        throw new UnauthorizedException(
          'This account uses social login. Please log in with Google.',
        );
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }
    return plainToInstance(ValidateResponse, user);
  }

  // JWT
  async login(
    user: ValidateResponse,
    sid: string,
  ) {
    const payload = {
      id: user.id,
      email: user.email,
      majorRole: user.majorRole,
      minorRole: user.minorRole,
    };

    // const refresh_token = await this.jwtService.signAsync(payload, {
    //   expiresIn: '7d',
    //   secret: this.config.get<string>('JWT_REFRESH_SECRET'),
    // });
    //
    // return {
    //   access_token: await this.jwtService.signAsync(payload),
    //   refresh_token,
    //   user: {
    //     id: user.id,
    //     name: user.name,
    //     email: user.email,
    //     majorRole: user.majorRole,
    //     minorRole: user.minorRole,
    //   },
    // };
  }

  // async register(data: RegisterDto) {
  //   const hashed = await bcrypt.hash(data.password, 10);
  //   const user = await this.prisma.user.create({
  //     data: { ...data, majorRole: MajorRole.KARYAWAN, password: hashed },
  //   });
  //   return this.login(user);
  // }

  async findById(id: string): Promise<User> {
    // const user = await this.prisma.user.findUnique({ where: { id } });
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
