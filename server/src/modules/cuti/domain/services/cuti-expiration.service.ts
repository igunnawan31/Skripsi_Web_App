import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DateUtilService } from 'src/common/utils/dateUtil';
import { ICutiRepository } from '../repositories/cuti.repository.interface';
import {
  CutiExpirationCompletedEvent,
  CutiExpiredEvent,
} from '../../application/events/cuti.events';
import { RetrieveCutiResponseDTO } from '../../application/dtos/response/read-response.dto';

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
  ) {}

  async expireOverdueCuti(): Promise<ExpirationResult> {
    const cutOffUTC = this.dateUtil.getTomorrowMidnightUTC();
    const timezone = this.dateUtil.getTimezone();
    const cutoffDateFormatted = this.dateUtil.formatLocal(
      this.dateUtil.getTodayUTC(),
      'YYYY-MM-DD',
    );

    try {
      const { count, list } =
        await this.cutiRepository.expireAndFetch(cutOffUTC);

      if (count > 0) {
        for (const cuti of list) {
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
        this.eventEmitter.emit(
          'cuti.expiration.completed',
          new CutiExpirationCompletedEvent(count, new Date()),
        );
      }

      return {
        expiredCount: count,
        processedAt: new Date(),
        timezone,
        cutoffDate: cutoffDateFormatted,
      };
    } catch (error) {
      throw error;
    }
  }

  async previewExpiringCuti(): Promise<RetrieveCutiResponseDTO[]> {
    const cutOffUTC = this.dateUtil.getTomorrowMidnightUTC();
    return await this.cutiRepository.findExpired(cutOffUTC);
  }
}
