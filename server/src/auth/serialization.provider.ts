import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { MajorRole, MinorRole, User } from '@prisma/client';
import { ValidateResponse } from './dto/response/validation-response.dto';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }
  serializeUser(
    user: ValidateResponse,
    done: (
      err: Error | null,
      user: ValidateResponse | null,
    ) => void,
  ) {
    try {
      if (!user) throw new Error('Invalid user data');
      done(null, {
        id: user.id,
        branchId: user.branchId,
        name: user.name,
        email: user.email,
        majorRole: user.majorRole,
        minorRole: user.minorRole ?? undefined,
      });
    } catch (error) {
      done(error, null);
    }
  }

  deserializeUser(
    payload: { id: string; role: string },
    done: (err: Error | null, user: Promise<User>) => void,
  ) {
    const user = this.authService.findById(payload.id);
    done(null, user);
  }
}
