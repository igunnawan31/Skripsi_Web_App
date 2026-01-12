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
    dokumen: {
        path: string;
        size: number;
        encoding: string;
        filename: string;
        mimetype: string;
        fieldname: string;
        destination: string;
        originalname: string;
    };
    user: User;
    createdAt: string;
    updatedAt: string;
}

export type CreateCutiRequest = {
    userId: string;
    startDate: string;
    endDate: string;
    reason: string;
    dokumenCuti?: File | null;
}