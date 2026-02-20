import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { INotificationRepository } from "../../domain/repositories/notifications.repository.interface";

@Injectable()
export class DeleteNotificationsUseCase {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepo: INotificationRepository,
  ) {}

  async execute(
    id: string,
  ): Promise<void> {
    const notification = await this.notificationRepo.findById(id);
    if (!notification) throw new NotFoundException('Notifikasi tidak ditemukan');

    await this.notificationRepo.remove(id);
    return;
  }
}
