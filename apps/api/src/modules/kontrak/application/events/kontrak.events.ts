import { MetodePembayaran } from "@prisma/client";

export class KontrakCreatedEvent {
  constructor(
    public readonly kontrakId: string,
    public readonly userId: string,
    public readonly projectId: string,
    public readonly cutiBulanan: number,
    public readonly absensiBulanan: number,
    public readonly totalBayaran: number,
    public readonly metodePembayaran: MetodePembayaran,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly createdBy: string,
    public readonly dpPercentage?: number,
    public readonly finalPercentage?: number,
  ) {}
}

export class KontrakEndedEvent {
  constructor(
    public readonly kontrakId: string,
    public readonly userId: string,
    public readonly endDate: Date,
  ) {}
}
