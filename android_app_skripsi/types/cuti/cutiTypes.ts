import { User } from "../user/userTypes";

export type CutiResponse = {
    id: string;
    userId: string;
    approverId: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: string;
    catatan: string;
    dokumen: string;
    user: User;
    createdAt: string;
    updatedAt: string;    
}