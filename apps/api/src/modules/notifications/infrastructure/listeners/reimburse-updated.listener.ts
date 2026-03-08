import { Injectable } from '@nestjs/common';
import { CreateNotificationUseCase } from '../../application/use-cases/create-notifications.use-cases';
import { OnEvent } from '@nestjs/event-emitter';
import { ReimburseUpdateEvent } from 'src/modules/reimburse/application/events/reimburse.events';
import { CreateNotificationDTO } from '../../application/dtos/request/create-notifications.dto';
import { LoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class ReimburseApprovedListener {
  constructor(
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly logger: LoggerService,
  ) {}

  @OnEvent('reimburse.updated')
  async handleReimbursePaid(event: ReimburseUpdateEvent) {
    try {
      const payload: CreateNotificationDTO = {
        userId: event.userId,
        title: `Reimburse ${event.approvalStatus === 'APPROVED' ? 'Disetujui' : 'Ditolak'}`,
        category: 'Reimburse',
        content: `${event.approvalStatus === 'APPROVED' ? 'Reimburse disetujui' : 'Reimburse ditolak, mohon periksa kembali permintaan reimburse'}`,
      };

      await this.createNotificationUseCase.execute(payload);

      return;
    } catch (err) {
      this.logger.error(err);
    }
  }
}
