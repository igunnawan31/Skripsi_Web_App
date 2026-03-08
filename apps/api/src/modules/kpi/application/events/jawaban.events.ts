export class JawabanSubmitEvent {
  constructor(
    public readonly indikatorId: string,
    public readonly evaluateeId: string
  ) {}
}
