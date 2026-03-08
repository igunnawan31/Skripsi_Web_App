import { IsString } from "class-validator";

export class CreateNotificationDTO {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsString()
  content: string;
}
