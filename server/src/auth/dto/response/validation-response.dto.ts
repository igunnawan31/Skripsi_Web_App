import { MajorRole, MinorRole } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

export class ValidateResponse {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  branchId: string;

  @Expose()
  majorRole: MajorRole;

  @Expose()
  minorRole?: MinorRole;
}
