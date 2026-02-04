import { IsOptional, IsString } from "class-validator";

export class CreateJawabanDTO {
  @IsString()
  indikatorId: string;

  @IsString()
  pertanyaanId: string;

  @IsString()
  dinilaiId: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
