import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CutiApprovedEvent, CutiCancelledEvent, CutiRejectedEvent } from '../../application/events/cuti.events';

@Injectable()
export class CutiNotificationListener {
  @OnEvent('cuti.approved')
  async handleCutiApproved(event: CutiApprovedEvent) {
    console.log(`   Cuti APPROVED:`);
    console.log(`   User: ${event.userName}`);
    console.log(`   Period: ${event.startDate.toLocaleDateString()} - ${event.endDate.toLocaleDateString()}`);
    console.log(`   Approved by: ${event.approverName}`);
    if (event.catatan) {
      console.log(`   Notes: ${event.catatan}`);
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
    console.log(`   Cuti REJECTED:`);
    console.log(`   User: ${event.userName}`);
    console.log(`   Rejected by: ${event.approverName}`);
    console.log(`   Reason: ${event.catatan}`);

    // Send email to user
    // await this.emailService.sendCutiRejectedNotification({
    //   to: event.userId,
    //   subject: 'Cuti Anda Ditolak',
    //   body: `Cuti Anda ditolak oleh ${event.approverName}. Alasan: ${event.catatan}`
    // });
  }

  @OnEvent('cuti.cancelled')
  async handleCutiCancelled(event: CutiCancelledEvent) {
    console.log(`   Cuti CANCELLED:`);
    console.log(`   Cuti ID: ${event.cutiId}`);
    console.log(`   User ID: ${event.userId}`);
    console.log(`   Cancelled by: ${event.cancelledBy}`);
    if (event.reason) {
      console.log(`   Reason: ${event.reason}`);
    }

    // Send notification
    // If cancelled by someone else (not the requester)
    if (event.userId !== event.cancelledBy) {
      // await this.emailService.sendCutiCancelledNotification({
      //   to: event.userId,
      //   subject: 'Cuti Anda Dibatalkan',
      //   body: `Cuti Anda telah dibatalkan. ${event.reason || ''}`
      // });
    }

    // Remove from calendar
    // await this.calendarService.removeEvent(event.cutiId);
  }
}

