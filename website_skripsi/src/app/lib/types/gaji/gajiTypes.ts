import { KontrakResponse } from "../kontrak/kontrakTypes";
import { User } from "../types";

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
    kontrak: KontrakResponse
};

export type PaySalary = {
    paychecks: File[] | null;
}