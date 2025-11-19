import { Expose } from "class-transformer";

export class GajiBaseDTO {
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
  createdAt: string;

  @Expose()
  updatedAt: string;
}
