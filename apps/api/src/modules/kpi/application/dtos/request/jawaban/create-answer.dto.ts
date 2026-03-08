import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateJawabanDTO {
  @IsString()
  indikatorId: string;

  @IsString()
  pertanyaanId: string;

  @IsString()
  evaluateeId: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  nilai: number;
}

export class InternalCreateJawabanDTO extends CreateJawabanDTO {
  @IsString()
  evaluatorId: string;
}
