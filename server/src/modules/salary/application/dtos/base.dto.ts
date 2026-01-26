import { Expose } from "class-transformer";
import { FileMetaData } from "src/common/types/FileMetaData.dto";

export class SalaryBaseDTO {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  kontrakId: string;

  @Expose()
  periode: string;

  @Expose()
  dueDate: string;

  @Expose()
  status: string;

  @Expose()
  amount: number;

  @Expose()
  paymentDate?: string;

  @Expose()
  paychecks?: FileMetaData[]; 

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
