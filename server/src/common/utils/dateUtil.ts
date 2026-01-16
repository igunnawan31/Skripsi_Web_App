import { BadRequestException, Injectable } from '@nestjs/common';
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

  parseDate(dateStr: string): Date {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));
      if (isNaN(date.getTime())) {
        throw new BadRequestException('Invalid date format');
      }
      return date;
    }

    // Allow ISO FORMAT
    if (
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/.test(
        dateStr,
      )
    ) {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new BadRequestException('Invalid ISO 8601 date-time format');
      }
      return date;
    }

    throw new BadRequestException('Date must be in YYYY-MM-DD format');
  }
}
