import { User } from "../types";

export enum ApprovalStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export type ReimburseResponse = {
    id: string;
    title: string;
    totalExpenses: number;
    approvalStatus: ApprovalStatus;
    catatan: string | null;
    documents: File[];
    
    userId: string;
    approverId: string | null;
    requester: User;
    approver: User | null;

    createdAt: string;
    updatedAt: string;
}