import { User } from "../user/userTypes";

export enum SalaryStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    OVERDUE = "OVERDUE",
}

export type SalaryResponse = {
    id: string,
    userId: string,
    kontrakId: string;
    periode: string;
    dueDate: string;
    amount: number;
    status: SalaryStatus;
    paymentDate?: string;
    paychecks?: string;
    createdAt: string;
    updatedAt: string;
    user: User;
};