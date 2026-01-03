import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DateUtilService } from 'src/common/utils/dateUtil';
import { ICutiRepository } from '../repositories/cuti.repository.interface';
import { CutiExpirationCompletedEvent, CutiExpiredEvent } from '../../application/events/cuti.events';

export interface ExpirationResult {
  expiredCount: number;
  processedAt: Date;
  timezone: string;
  cutoffDate: string;
}

@Injectable()
export class CutiExpirationService {
  constructor(
    private readonly cutiRepository: ICutiRepository,
    private readonly dateUtil: DateUtilService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  /**
   * Expire all pending cuti that have passed their start date
   * @returns Number of cuti that were expired
   */
  async expireOverdueCuti(): Promise<ExpirationResult> {
    const todayUTC = this.dateUtil.getTodayUTC();
    const timezone = this.dateUtil.getTimezone();
    const cutoffDateFormatted = this.dateUtil.formatLocal(
      todayUTC,
      'YYYY-MM-DD',
    );

    // this.logger.log(
    //   `Starting cuti expiration check. Timezone: ${timezone}, Cutoff date: ${cutoffDateFormatted}`,
    // );

    try {
      // Get all cuti that will be expired (for event emission)
      const expiredCutiList = await this.cutiRepository.findExpired(todayUTC);

      // Expire them
      const expiredCount =
        await this.cutiRepository.expirePendingCutiBefore(todayUTC);

      if (expiredCount > 0) {
        // this.logger.log(`Successfully expired ${expiredCount} pending cuti`);

        // Emit individual events for each expired cuti (for notifications)
        for (const cuti of expiredCutiList) {
          this.eventEmitter.emit(
            'cuti.expired',
            new CutiExpiredEvent(
              cuti.id,
              cuti.userId,
              cuti.startDate,
              cuti.endDate,
              cuti.reason,
            ),
          );
        }

        // Emit summary event
        this.eventEmitter.emit(
          'cuti.expiration.completed',
          new CutiExpirationCompletedEvent(expiredCount, new Date()),
        );
      } else {
        // this.logger.log('No pending cuti to expire');
      }

      return {
        expiredCount,
        processedAt: new Date(),
        timezone,
        cutoffDate: cutoffDateFormatted,
      };
    } catch (error) {
      // this.logger.error(`Failed to expire cuti: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Preview cuti that will be expired (for testing/debugging)
   */
  async previewExpiringCuti(): Promise<any[]> {
    const todayUTC = this.dateUtil.getTodayUTC();
    return await this.cutiRepository.findExpired(todayUTC);
  }
}
