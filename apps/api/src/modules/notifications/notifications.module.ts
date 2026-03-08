import { Module } from '@nestjs/common';
import { NotificationsController } from './presentation/notifications.controller';
import { CreateNotificationUseCase } from './application/use-cases/create-notifications.use-cases';
import { DeleteNotificationsUseCase } from './application/use-cases/delete-notifications.use-case';
import { GetAllNotificationsUseCase } from './application/use-cases/get-all-notifications.use-case';
import { GetNotificationUseCase } from './application/use-cases/get-notification.use-case';
import { INotificationRepository } from './domain/repositories/notifications.repository.interface';
import { NotificationRepository } from './infrastructure/persistence/notifications.repository';
import { ReimburseApprovedListener } from './infrastructure/listeners/reimburse-updated.listener';
import { SalaryPaidListener } from './infrastructure/listeners/salary-paid.listener';
import { CutiNotificationListener } from './infrastructure/listeners/cuti-approval.listener';

@Module({
  controllers: [NotificationsController],
  providers: [
    CreateNotificationUseCase,
    DeleteNotificationsUseCase,
    GetAllNotificationsUseCase,
    GetNotificationUseCase,
    ReimburseApprovedListener,
    SalaryPaidListener,
    CutiNotificationListener,
    { provide: INotificationRepository, useClass: NotificationRepository },
  ],
})
export class NotificationsModule {}
