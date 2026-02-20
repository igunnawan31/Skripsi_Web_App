import { Expose } from "class-transformer";

export class NotificationBaseDTO {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  title: string;

  @Expose()
  category: string;

  @Expose()
  content: string;

  @Expose()
  createdAt: string;
}
