import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment-timezone';

@Injectable()
export class DateUtilService {
  private readonly timezone: string;

  constructor(private readonly configService: ConfigService) {
    this.timezone = this.configService.get<string>('TZ', 'Asia/Jakarta');
  }

  getTodayUTC(): Date {
    return moment.tz(this.timezone).startOf('day').utc().toDate();
  }

  startOfDayUTC(date: Date | string): Date {
    return moment.tz(date, this.timezone).startOf('day').utc().toDate();
  }

  endOfDayUTC(date: Date | string): Date {
    return moment.tz(date, this.timezone).endOf('day').utc().toDate();
  }

  formatLocal(date: Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
    return moment.utc(date).tz(this.timezone).format(format);
  }

  isPast(date: Date): boolean {
    const now = moment.tz(this.timezone);
    const compareDate = moment.tz(date, this.timezone);
    return compareDate.isBefore(now, 'day');
  }

  getTimezone(): string {
    return this.timezone;
  }
}
