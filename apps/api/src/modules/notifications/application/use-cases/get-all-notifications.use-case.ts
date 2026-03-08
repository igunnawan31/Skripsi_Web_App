import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository } from '../../domain/repositories/notifications.repository.interface';
import { RetrieveNotificationResponseDTO } from '../dtos/response/read-response.dto';

@Injectable()
export class GetAllNotificationsUseCase {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepo: INotificationRepository,
  ) {}

  async execute(
    userId: string,
  ): Promise<RetrieveNotificationResponseDTO[] | null> {
    const notifications = await this.notificationRepo.findAll(userId);
    if (!notifications) return null;
    return notifications;
  }
}
