import { WorkStatus } from "@prisma/client";

export class AbsensiCheckedInEvent {
  constructor(
    public readonly userId: string,
    public readonly date: Date,
    public readonly workStatus: WorkStatus,
    public readonly isLate: boolean,
  ) {}
}

export class AbsensiCheckedOutEvent {
  constructor(
    public readonly userId: string,
    public readonly date: Date,
    public readonly checkIn: Date,
    public readonly checkOut: Date,
    public readonly duration: number, // in minutes
  ) {}
}
