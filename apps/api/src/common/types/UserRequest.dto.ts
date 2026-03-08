import { MajorRole, MinorRole } from "@prisma/client";

export class UserRequest {
  id: string;
  name: string;
  email: string;
  majorRole: MajorRole;
  minorRole: MinorRole;
}

