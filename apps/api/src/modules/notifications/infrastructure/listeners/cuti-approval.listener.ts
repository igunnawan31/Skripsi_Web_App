import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  CutiApprovedEvent,
  CutiCancelledEvent,
  CutiRejectedEvent,
} from 'src/modules/cuti/application/events/cuti.events';
import { CreateNotificationUseCase } from '../../application/use-cases/create-notifications.use-cases';
import { LoggerService } from 'src/modules/logger/logger.service';
import { CreateNotificationDTO } from '../../application/dtos/request/create-notifications.dto';

@Injectable()
export class CutiNotificationListener {
  constructor(
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly logger: LoggerService,
  ) { }
  @OnEvent('cuti.approved')
  async handleCutiApproved(event: CutiApprovedEvent) {
    try {
      const payload: CreateNotificationDTO = {
        userId: event.userId,
        title: `Cuti Approved`,
        category: 'Cuti',
        content: `Cuti telah disetujui, silahkan periksa kembali detail cuti yang telah diajukan`,
      };

      await this.createNotificationUseCase.execute(payload);
      return;
    } catch (err) {
      this.logger.error(err);
    }

    // Send email to user
    // await this.emailService.sendCutiApprovedNotification({
    //   to: event.userId,
    //   subject: 'Cuti Anda Disetujui',
    //   body: `Cuti Anda dari ${event.startDate} sampai ${event.endDate} telah disetujui oleh ${event.approverName}`
    // });

    // Send to calendar integration
    // await this.calendarService.addEvent({
    //   userId: event.userId,
    //   title: 'Cuti',
    //   start: event.startDate,
    //   end: event.endDate,
    // });
  }

  @OnEvent('cuti.rejected')
  async handleCutiRejected(event: CutiRejectedEvent) {
    try {
      const payload: CreateNotificationDTO = {
        userId: event.userId,
        title: `Cuti Rejected`,
        category: 'Cuti',
        content: `Cuti telah ditolak, silahkan periksa kembali detail cuti yang telah diajukan`,
      };

      await this.createNotificationUseCase.execute(payload);
      return;
    } catch (err) {
      this.logger.error(err);
    }
    // Send email to user
    // await this.emailService.sendCutiRejectedNotification({
    //   to: event.userId,
    //   subject: 'Cuti Anda Ditolak',
    //   body: `Cuti Anda ditolak oleh ${event.approverName}. Alasan: ${event.catatan}`
    // });
  }

  @OnEvent('cuti.cancelled')
  async handleCutiCancelled(event: CutiCancelledEvent) {
    try {
      const payload: CreateNotificationDTO = {
        userId: event.userId,
        title: `Cuti Dibatalkan`,
        category: 'Cuti',
        content: `Cuti telah dibatalkan, silahkan periksa kembali detail cuti yang telah diajukan`,
      };

      if (event.userId !== event.cancelledBy) {
        await this.createNotificationUseCase.execute(payload);
      }
      return;
    } catch (err) {
      this.logger.error(err);
    }
    // Send notification
    // If cancelled by someone else (not the requester)
    // if (event.userId !== event.cancelledBy) {
    // await this.emailService.sendCutiCancelledNotification({
    //   to: event.userId,
    //   subject: 'Cuti Anda Dibatalkan',
    //   body: `Cuti Anda telah dibatalkan. ${event.reason || ''}`
    // });
    // }
    // Remove from calendar
    // await this.calendarService.removeEvent(event.cutiId);
  }
}
