import { EmployeeType, MajorRole, MinorRole } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";
import { FileMetaData } from "src/common/types/FileMetaData.dto";

export class UserBaseDTO {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  majorRole: MajorRole;

  @Expose()
  minorRole: MinorRole;

  @Expose()
  photo: FileMetaData;
}
