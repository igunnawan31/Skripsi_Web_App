import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { format, addMonths, isBefore, isEqual } from 'date-fns';
import { MetodePembayaran } from '@prisma/client';
import { CreateSalaryUseCase } from '../../application/use-cases/create-salary.use-case';
import { KontrakCreatedEvent } from 'src/modules/kontrak/application/events/kontrak.events';

@Injectable()
export class KontrakCreatedListener {
  constructor(private readonly createSalaryUseCase: CreateSalaryUseCase) {}

  @OnEvent('kontrak.created')
  async handleKontrakCreated(event: KontrakCreatedEvent) {
    try {
      console.log('Listener invoked for kontrak:', event.kontrakId);

      const {
        startDate,
        endDate,
        userId,
        kontrakId,
        totalBayaran,
        metodePembayaran,
        dpPercentage,
        finalPercentage,
      } = event;

      if (!endDate) {
        console.warn(
          `Kontrak ${kontrakId} has no endDate – skipping salary generation`,
        );
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      switch (metodePembayaran) {
        case MetodePembayaran.MONTHLY:
          await this.createMonthlySalaries(
            userId,
            kontrakId,
            totalBayaran,
            start,
            end,
          );
          break;
        case MetodePembayaran.TERMIN:
          await this.createTerminSalaries(
            userId,
            kontrakId,
            totalBayaran,
            start,
            end,
            dpPercentage,
            finalPercentage,
          );
          break;
        case MetodePembayaran.FULL:
          await this.createFullSalary(
            userId,
            kontrakId,
            totalBayaran,
            start,
            end,
          );
          break;
        default:
          console.warn(
            `Unsupported payment method: ${metodePembayaran} for kontrak ${kontrakId}`,
          );
          return;
      }

      console.log(`Successfully generated salaries for kontrak ${kontrakId}`);
    } catch (error) {
      console.error(
        `Failed to generate salaries for kontrak ${event.kontrakId}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  private async createMonthlySalaries(
    userId: string,
    kontrakId: string,
    totalAmount: number,
    start: Date,
    end: Date,
  ) {
    let cursor = new Date(start);
    let monthCount = 0;

    while (isBefore(cursor, end) || isEqual(cursor, end)) {
      monthCount++;
      cursor = addMonths(cursor, 1);
    }

    if (monthCount === 0) {
      throw new Error('Range tanggal invalid untuk membuat record salary');
    }

    const baseAmount = Math.floor(totalAmount / monthCount);
    const remainder = totalAmount - baseAmount * monthCount;

    // Reset cursor
    let current = new Date(start);
    let index = 0;

    while (isBefore(current, end) || isEqual(current, end)) {
      const periode = format(current, 'yyyy-MM');

      // Due date: 5th of next month
      const dueDate = new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        5,
      );

      // remainder ditambahkan ke bulan terakhir
      const amount =
        index === monthCount - 1 ? baseAmount + remainder : baseAmount;

      await this.createSalaryUseCase.execute({
        userId,
        kontrakId,
        periode,
        dueDate,
        amount: amount,
      });

      current = addMonths(current, 1);
      index++;
    }
  }

  private async createTerminSalaries(
    userId: string,
    kontrakId: string,
    totalAmount: number,
    start: Date,
    end: Date,
    dpPercentage?: number,
    finalPercentage?: number,
  ) {
    // Default: 50% DP, 50% final kalo datanya nggak provided
    const dpPct = dpPercentage ?? 50;
    const finalPct = finalPercentage ?? 100 - dpPct;

    const dpAmount = Math.round((totalAmount * dpPct) / 100);
    const finalAmount = Math.round((totalAmount * finalPct) / 100);

    // DP: di bulan pertama → periode = YYYY-MM dari startDate
    const dpPeriod = format(start, 'yyyy-MM');
    const dpDueDate = new Date(start.getFullYear(), start.getMonth(), 28);

    await this.createSalaryUseCase.execute({
      userId,
      kontrakId,
      periode: dpPeriod,
      dueDate: dpDueDate,
      amount: dpAmount,
    });

    // Final: di bulan terakhir → periode = YYYY-MM dari endDate
    const finalPeriod = format(end, 'yyyy-MM');
    const finalDueDate = new Date(end.getFullYear(), end.getMonth(), 28);

    // Biar gak duplikat kalo kontrak cuma 1 bulan
    if (dpPeriod !== finalPeriod) {
      await this.createSalaryUseCase.execute({
        userId,
        kontrakId,
        periode: finalPeriod,
        dueDate: finalDueDate,
        amount: finalAmount,
      });
    } else {
      // Kalo periode sama, digabung
      await this.createSalaryUseCase.execute({
        userId,
        kontrakId,
        periode: dpPeriod,
        dueDate: finalDueDate,
        amount: totalAmount,
      });
    }
  }

  private async createFullSalary(
    userId: string,
    kontrakId: string,
    totalAmount: number,
    start: Date,
    end: Date,
  ) {
    const periode = format(start, 'yyyy-MM');
    const dueDate = new Date(end.getFullYear(), end.getMonth(), 28);

    await this.createSalaryUseCase.execute({
      userId,
      kontrakId,
      periode,
      dueDate,
      amount: totalAmount,
    });
  }
}
