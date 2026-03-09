import { MajorRole, MinorRole } from 'src/generated/prisma/enums';

export interface JwtPayload {
  sub: string;
  email: string;
  majorRole: MajorRole;
  minorRole: MinorRole;
  exp: number;
  sid: string;
}
