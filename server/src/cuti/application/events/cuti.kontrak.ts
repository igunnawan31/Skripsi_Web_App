export class CutiSubmittedEvent {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly startDate: string,
    public readonly endDate: string,
    public readonly approverId?: string,
  ) { }
}
