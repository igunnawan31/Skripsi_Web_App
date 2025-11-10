import { MajorRole, MinorRole } from '@prisma/client';
import 'express-session';
declare module 'express-session' {
  interface SessionData {
    passport?: {
      user: {
        id: string;
        name: string;
        email: string;
        majorRole: MajorRole;
        minorRole: MinorRole;
      };
    };
  }
}
