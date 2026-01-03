import { StatusCuti } from "@prisma/client";
import { Expose } from "class-transformer";
import { FileMetaData } from "src/common/types/FileMetaData.dto";

export class CutiBaseDTO {
  @Expose()
  id: string;
  
  @Expose()
  userId: string;
  
  @Expose()
  approverId?: string;
  
  @Expose()
  startDate: string;
  
  @Expose()
  endDate: string;
  
  @Expose()
  reason: string;
  
  @Expose()
  status: StatusCuti;
  
  @Expose()
  catatan?: string;
  
  @Expose()
  createdAt: string;
  
  @Expose()
  updatedAt: string;

  @Expose()
  dokumen: FileMetaData;
}
