export class CutiSubmittedEvent {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly approverId?: string,
  ) { }
}

export class CutiApprovedEvent {
  constructor(
    public readonly cutiId: string,
    public readonly userId: string,
    public readonly userName: string,
    public readonly approverName: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly catatan?: string,
  ) { }
}

export class CutiRejectedEvent {
  constructor(
    public readonly cutiId: string,
    public readonly userId: string,
    public readonly userName: string,
    public readonly approverName: string,
    public readonly catatan: string,
  ) { }
}

export class CutiCancelledEvent {
  constructor(
    public readonly cutiId: string,
    public readonly userId: string,
    public readonly cancelledBy: string,
    public readonly reason?: string,
  ) { }
}
