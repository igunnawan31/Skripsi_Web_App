import { ApprovalStatus } from "@prisma/client";
import { Expose } from "class-transformer";
import { FileMetaData } from "src/common/types/FileMetaData.dto";

export class ReimburseBaseDTO {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  totalExpenses: number;

  @Expose()
  approvalStatus: ApprovalStatus;
  
  @Expose()
  notes: string;

  @Expose()
  documents: FileMetaData[];

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  userId: string;

  @Expose()
  approverId: string;
}
