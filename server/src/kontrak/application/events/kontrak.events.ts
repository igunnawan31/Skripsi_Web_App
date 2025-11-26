export class KontrakCreatedEvent {
  constructor(
    public readonly kontrakId: string,
    public readonly userId: string,
    public readonly projectId: string,
    public readonly cutiBulanan: number,
    public readonly absensiBulanan: number,
    public readonly totalBayaran: number,
    public readonly tanggalMulai: string,
    public readonly tanggalSelesai: string,
    public readonly createdBy: string,
    public readonly dpPercentage?: number,
    public readonly finalPercentage?: number,
  ) {}
}

export class KontrakEndedEvent {
  constructor(
    public readonly kontrakId: string,
    public readonly userId: string,
    public readonly tanggalSelesai: Date,
  ) {}
}
