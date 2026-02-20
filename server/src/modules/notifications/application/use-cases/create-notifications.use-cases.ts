import { Inject, Injectable } from "@nestjs/common";
import { INotificationRepository } from "../../domain/repositories/notifications.repository.interface";
import { CreateNotificationDTO } from "../dtos/request/create-notifications.dto";

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepo: INotificationRepository,
  ) {}

  async execute(data: CreateNotificationDTO): Promise<void> {
    await this.notificationRepo.create(data);
  }
}
