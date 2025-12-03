// src/gaji/application/services/gaji-scheduling.service.ts

import { Injectable, Inject } from '@nestjs/common';
import { IGajiRepository } from '../repositories/gaji.repository.interface';
import { KontrakCreatedEvent } from 'src/kontrak/application/events/kontrak.events';
import { MetodePembayaran } from '@prisma/client';
import { GajiStatus } from '@prisma/client';
import { CreateGajiDTO } from 'src/gaji/application/dtos/request/create-gaji.dto';

@Injectable()
export class GajiSchedulingService {
  constructor(
    @Inject(IGajiRepository)
    private readonly gajiRepo: IGajiRepository,
  ) { }

  async generateGajiFromKontrak(event: KontrakCreatedEvent): Promise<void> {
    const {
      kontrakId,
      userId,
      metodePembayaran,
      totalBayaran,
      startDate,
      endDate,
      dpPercentage = 0,
      finalPercentage = 100,
    } = event;

    const existingGaji = await this.gajiRepo.findByKontrakId(event.kontrakId);
    if (existingGaji && existingGaji.length > 0) {
      console.log(
        `ℹ️ Gaji for kontrak ${event.kontrakId} already exists. Skipping.`,
      );
      return;
    }

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    if (!end && metodePembayaran !== MetodePembayaran.TERMIN) {
      throw new Error('endDate diperlukan untuk metode pembayaran non-TERMIN');
    }

    switch (metodePembayaran) {
      case MetodePembayaran.BULANAN:
        if (!end) throw new Error('endDate required for BULANAN');
        await this.generateMonthlyGaji(
          kontrakId,
          userId,
          totalBayaran,
          start,
          end,
        );
        break;

      case MetodePembayaran.FULL:
        if (!end) throw new Error('endDate required for FULL');
        await this.generateFullGaji(kontrakId, userId, totalBayaran, end);
        break;

      case MetodePembayaran.TERMIN:
        await this.generateTerminGaji(
          kontrakId,
          userId,
          totalBayaran,
          dpPercentage,
          finalPercentage,
          start,
          end,
        );
        break;

      default:
        throw new Error(`Unsupported payment method: ${metodePembayaran}`);
    }
  }

  private async generateMonthlyGaji(
    kontrakId: string,
    userId: string,
    totalBayaran: number,
    startDate: Date,
    endDate: Date,
  ): Promise<void> {
    const records: CreateGajiDTO[] = [];
    const current = new Date(
      Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1),
    );
    const last = new Date(
      Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), 1),
    );

    while (current <= last) {
      const periode = `${current.getUTCFullYear()}-${String(current.getUTCMonth() + 1).padStart(2, '0')}`;

      // Cek existing
      const exists = await this.gajiRepo.findByKontrakIdAndPeriode(
        kontrakId,
        periode,
      );
      if (!exists) {
        // dueDate: awal bulan berikutnya (UTC)
        const dueDate = new Date(
          Date.UTC(current.getUTCFullYear(), current.getUTCMonth() + 1, 1),
        ).toISOString();
        records.push({
          userId,
          kontrakId,
          periode,
          dueDate,
          amount: totalBayaran,
          status: GajiStatus.BELUM_DIBAYAR,
        });
      }

      current.setUTCMonth(current.getUTCMonth() + 1);
    }

    for (const record of records) {
      await this.gajiRepo.create(record);
    }
  }

  private async generateFullGaji(
    kontrakId: string,
    userId: string,
    totalBayaran: number,
    dueDateInput: Date,
  ): Promise<void> {
    const periode = 'FULL';
    const exists = await this.gajiRepo.findByKontrakIdAndPeriode(
      kontrakId,
      periode,
    );
    if (exists) return;

    const dueDate = new Date(
      Date.UTC(
        dueDateInput.getUTCFullYear(),
        dueDateInput.getUTCMonth(),
        dueDateInput.getUTCDate(),
      ),
    ).toISOString();

    await this.gajiRepo.create({
      userId,
      kontrakId,
      periode,
      dueDate,
      amount: totalBayaran,
      status: GajiStatus.BELUM_DIBAYAR,
    });
  }

    private async generateTerminGaji(
    kontrakId: string,
    userId: string,
    totalBayaran: number,
    dpPercentage: number | null,
    finalPercentage: number | null,
    startDate: Date,
    endDate: Date | null,
  ): Promise<void> {
    // DP
    if (dpPercentage && dpPercentage > 0) {
      const periode = 'DP';
      const exists = await this.gajiRepo.findByKontrakIdAndPeriode(kontrakId, periode);
      if (!exists) {
        const dueDate = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate())).toISOString();
        const amount = Math.round((totalBayaran * dpPercentage) / 100);
        await this.gajiRepo.create({
          userId,
          kontrakId,
          periode,
          dueDate,
          amount,
          status: GajiStatus.BELUM_DIBAYAR,
        });
      }
    }

    // Final
    if (finalPercentage && finalPercentage > 0) {
      const periode = 'FINAL';
      const exists = await this.gajiRepo.findByKontrakIdAndPeriode(kontrakId, periode);
      if (!exists) {
        const dueDateInput = endDate || startDate;
        const dueDate = new Date(Date.UTC(
          dueDateInput.getUTCFullYear(),
          dueDateInput.getUTCMonth(),
          dueDateInput.getUTCDate()
        )).toISOString();
        const amount = Math.round((totalBayaran * finalPercentage) / 100);
        await this.gajiRepo.create({
          userId,
          kontrakId,
          periode,
          dueDate,
          amount,
          status: GajiStatus.BELUM_DIBAYAR,
        });
      }
    }
  }
}
