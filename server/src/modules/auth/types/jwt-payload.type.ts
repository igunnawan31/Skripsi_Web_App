import { MajorRole, MinorRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  majorRole: MajorRole;
  minorRole: MinorRole;
  exp: number;
  sid: string;
}
