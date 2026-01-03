import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { MajorRole, MinorRole } from '@prisma/client';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(payload: JwtPayload): Promise<{
    id: string;
    email: string;
    majorRole: MajorRole;
    minorRole: MinorRole;
    exp: number;
  }> {
    // payload = { sub, email, role }
    return {
      id: payload.sub,
      email: payload.email,
      majorRole: payload.majorRole,
      minorRole: payload.minorRole,
      exp: payload.exp,
    };
  }
}

