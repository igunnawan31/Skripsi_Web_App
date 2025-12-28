import { EmployeeType, KontrakKerjaStatus, MetodePembayaran } from "@prisma/client";
import { Expose } from "class-transformer";
import { FileMetaData } from "src/common/types/FileMetaData.dto";

export class KontrakBaseDTO {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  projectId: string;

  @Expose()
  jenis: EmployeeType;

  @Expose()
  metodePembayaran: MetodePembayaran;

  @Expose()
  dpPercentage?: number;

  @Expose()
  finalPercentage?: number;

  @Expose()
  totalBayaran: number;

  @Expose()
  absensiBulanan: number;

  @Expose()
  cutiBulanan: number;

  @Expose()
  status: KontrakKerjaStatus;

  @Expose()
  catatan?: string;

  @Expose()
  documents: FileMetaData[];

  @Expose()
  startDate: string;

  @Expose()
  endDate: string;

  @Expose()
  tanggalSelesai?: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
