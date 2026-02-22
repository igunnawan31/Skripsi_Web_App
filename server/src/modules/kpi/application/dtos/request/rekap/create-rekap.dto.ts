import { IsNumber, IsString } from "class-validator";

export class CreateIndikatorRekapDTO {
  @IsString()
  indikatorId: string;

  @IsString()
  userId: string;

  @IsNumber()
  totalNilai: number;

  @IsNumber()
  rataRata: number;

  @IsNumber()
  jumlahPenilai: number;
}
