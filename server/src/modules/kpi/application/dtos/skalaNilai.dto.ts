import { Expose } from "class-transformer";

export class SkalaNilaiBaseDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  valueType: string;

  @Expose()
  valueRange: string[];

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
