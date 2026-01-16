import { AgendaFreq } from '@prisma/client';
import { addDays, addMonths, addWeeks, isAfter } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
const MAX_OCCURRENCES = 1000;

export class RecurrenceGenerator {
  static generate(params: {
    startDate: Date; // UTC
    timezone: string;
    frequency: AgendaFreq;
    count?: number;
    until?: Date;
  }): Date[] {
    const { frequency, startDate, timezone, count, until } = params;
    const localStart = toZonedTime(startDate, timezone);

    const occurrences: Date[] = [];
    let currentLocal = localStart;
    let i = 0;

    while (true) {
      if (count !== undefined && i >= count) break;
      if (i > MAX_OCCURRENCES) {
        throw new Error('Recurrence generated too many occurrences');
      }

      const currentUtc = fromZonedTime(currentLocal, timezone);
      if (until && isAfter(currentUtc, until)) break;

      occurrences.push(currentUtc);

      // Apply recurrence in LOCAL time
      switch (frequency) {
        case AgendaFreq.DAILY:
          currentLocal = addDays(currentLocal, 1);
          break;
        case AgendaFreq.WEEKLY:
          currentLocal = addWeeks(currentLocal, 1);
          break;
        case AgendaFreq.MONTHLY:
          currentLocal = addMonths(currentLocal, 1);
          break;
        default:
          throw new Error(`Unsupported frequency: ${frequency}`);
      }

      i++;
    }

    return occurrences;
  }
}
