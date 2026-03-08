import { IsString } from 'class-validator';

export class DeleteEvaluationDTO {
  @IsString()
  indikatorId: string;

  @IsString()
  evaluateeId: string;

  @IsString()
  evaluatorId: string;
}
