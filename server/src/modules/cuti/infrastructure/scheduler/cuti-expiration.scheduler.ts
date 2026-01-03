import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { DateUtilService } from 'src/common/utils/dateUtil';
import { LoggerService } from 'src/modules/logger/logger.service';
import { CutiExpirationService } from '../../domain/services/cuti-expiration.service';

@Injectable()
export class CutiExpirationScheduler {
  private readonly logger: LoggerService;
  private readonly cronExpression: string;
  private readonly enabled: boolean;
  private readonly timezone: string;

  constructor(
    private readonly cutiExpirationService: CutiExpirationService,
    private readonly configService: ConfigService,
    private readonly dateUtil: DateUtilService,
    private readonly schedulerRegistry: SchedulerRegistry,
    loggerService: LoggerService,
  ) {
    this.logger = loggerService;
    this.logger.setContext(CutiExpirationScheduler.name);
    this.timezone = this.configService.getOrThrow<string>('TZ', 'Asia/Jakarta')
    this.cronExpression = this.configService.get<string>(
      'scheduler.cutiExpiration.cronExpression',
      '0 1 * * *',
    );
    this.enabled = this.configService.get<boolean>(
      'scheduler.cutiExpiration.enabled',
      true,
    );

    this.logSchedulerStatus();
  }

  /**
   * Cron job to expire pending cuti
   * Runs based on config (default: 01:00 daily)
   */
  @Cron('0 1 * * *', {
    name: 'cuti-expiration',
    timeZone: process.env.TZ,
  })
  async handleCutiExpiration() {
    if (!this.enabled) {
      this.logger.warn('Cuti expiration scheduler is disabled');
      return;
    }

    this.logger.log('[Cron] Starting cuti expiration job...');

    try {
      const result = await this.cutiExpirationService.expireOverdueCuti();

      this.logger.log(
        `[Cron] Cuti expiration completed: ${result.expiredCount} cuti expired ` +
        `(Timezone: ${result.timezone}, Cutoff: ${result.cutoffDate})`
      );
    } catch (error) {
      this.logger.error(
        `[Cron] Cuti expiration failed: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Manual trigger for testing
   */
  async triggerManually(): Promise<any> {
    this.logger.log('[Manual] Triggering cuti expiration...');

    try {
      const result = await this.cutiExpirationService.expireOverdueCuti();

      this.logger.log(
        `[Manual] Cuti expiration completed: ${result.expiredCount} cuti expired`
      );

      return {
        success: true,
        data: result,
        message: `Successfully expired ${result.expiredCount} pending cuti`,
      };
    } catch (error) {
      this.logger.error(
        `[Manual] Cuti expiration failed: ${error.message}`,
        error.stack,
      );

      return {
        success: false,
        error: error.message,
        message: 'Failed to expire cuti',
      };
    }
  }

  /* Preview cuti yang akan expired (buat debugging) */
  async previewExpiring(): Promise<any> {
    this.logger.log('[Preview] Checking cuti that will be expired...');

    try {
      const cutiList = await this.cutiExpirationService.previewExpiringCuti();
      const todayUTC = this.dateUtil.getTodayUTC();

      return {
        success: true,
        data: {
          count: cutiList.length,
          cutoffDate: this.dateUtil.formatLocal(todayUTC, 'YYYY-MM-DD'),
          timezone: this.dateUtil.getTimezone(),
          cutiList: cutiList.map(c => ({
            id: c.id,
            userId: c.userId,
            userName: c.user?.name,
            startDate: this.dateUtil.formatLocal(c.startDate, 'YYYY-MM-DD'),
            endDate: this.dateUtil.formatLocal(c.endDate, 'YYYY-MM-DD'),
            reason: c.reason,
          })),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to preview expiring cuti: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get scheduler status and next run time
   */
  getSchedulerInfo() {
    try {
      const job = this.schedulerRegistry.getCronJob('cuti-expiration');
      
      return {
        enabled: this.enabled,
        cronExpression: this.cronExpression,
        timezone: this.dateUtil.getTimezone(),
        // running: job.running,
        // lastDate: job.lastDate()?.toISOString(),
        // nextDate: job.nextDate()?.toISOString(),
      };
    } catch (error) {
      return {
        enabled: this.enabled,
        cronExpression: this.cronExpression,
        timezone: this.dateUtil.getTimezone(),
        error: 'Job not found',
      };
    }
  }

  /**
   * Stop the scheduler
   */
  stop() {
    try {
      const job = this.schedulerRegistry.getCronJob('cuti-expiration');
      job.stop();
      this.logger.warn('Cuti expiration scheduler stopped');
    } catch (error) {
      this.logger.error('Failed to stop scheduler');
    }
  }

  /**
   * Start the scheduler
   */
  start() {
    try {
      const job = this.schedulerRegistry.getCronJob('cuti-expiration');
      job.start();
      this.logger.log('Cuti expiration scheduler started');
    } catch (error) {
      this.logger.error('Failed to start scheduler');
    }
  }

  private logSchedulerStatus() {
    this.logger.log(
      `Cuti Expiration Scheduler initialized - ` +
      `Enabled: ${this.enabled}, Cron: ${this.cronExpression}, Timezone: ${this.dateUtil.getTimezone()}`
    );
  }
}

