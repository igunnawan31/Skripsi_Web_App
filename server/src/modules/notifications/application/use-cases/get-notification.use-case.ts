import { Inject, Injectable } from "@nestjs/common";
import { INotificationRepository } from "../../domain/repositories/notifications.repository.interface";
import { RetrieveNotificationResponseDTO } from "../dtos/response/read-response.dto";

@Injectable()
export class GetNotificationUseCase {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepo: INotificationRepository,
  ) {}

  async execute(
    id: string,
  ): Promise<RetrieveNotificationResponseDTO | null> {
    const notification = await this.notificationRepo.findById(id);
    if (!notification) return null;
    return notification;
  }
}
