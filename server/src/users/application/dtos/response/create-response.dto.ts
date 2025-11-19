import { MajorRole, MinorRole } from "@prisma/client";
import { Expose } from "class-transformer";
import { FileMetaData } from "src/common/types/FileMetaData.dto";

export class CreateUserResponseDTO {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  password: string;

  @Expose()
  majorRole: MajorRole;

  @Expose()
  minorRole: MinorRole;

  @Expose()
  photo?: FileMetaData;
}
