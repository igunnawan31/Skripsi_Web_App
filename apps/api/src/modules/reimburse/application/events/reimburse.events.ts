import { ApprovalStatus } from "src/generated/prisma/enums";

export class ReimburseUpdateEvent {
  constructor(
    public readonly reimburseId: string,
    public readonly userId: string,
    public readonly approverId: string,
    public readonly approvalStatus: ApprovalStatus,
  ) {}
}
