import { CutiStatus } from "../enumTypes"
import { User } from "../types"

export type CutiResponse = {
    id: string,
    userId: string,
    approverId: string,
    startDate: string,
    endDate: string,
    reason: string,
    status: CutiStatus,
    catatan: string,
    createdAt: string,
    updatedAt: string,
    dokumen: any,
    user: User,
    approver: User,
}