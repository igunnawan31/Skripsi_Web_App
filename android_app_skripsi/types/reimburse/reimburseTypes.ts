import { User } from "../user/userTypes";

export type UploadFile = {
    uri: string;
    name: string;
    type: string;
};

export enum ApprovalStatus {
    APPROVED = "APPROVED",
    PENDING = "PENDING",
    REJECTED = "REJECTED",
}

export type ReimburseResponse = {
    id: string;
    title: string;
    userId: string;
    approverId: string;
    approvalStatus: string;
    rejectReason: string;
    totalExpenses: number;

    documents: {
        path: string;
        size: number;
        encoding: string;
        filename: string;
        mimetype: string;
        fieldname: string;
        destination: string;
        originalname: string;
    };
    requester: User;
    approver: User;
    createdAt: string;
    updatedAt: string;
}

export type CreateReimburseRequest = {
    title: string;
    totalExpenses: number;
    reimburseDocuments: UploadFile[];
}