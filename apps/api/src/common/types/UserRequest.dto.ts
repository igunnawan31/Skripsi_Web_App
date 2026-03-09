import { MajorRole, MinorRole } from "src/generated/prisma/enums";

export class UserRequest {
  id: string;
  name: string;
  email: string;
  majorRole: MajorRole;
  minorRole: MinorRole;
}

