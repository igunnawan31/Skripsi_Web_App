export class SalaryCreatedEvent {
    constructor(
        public readonly salaryId: string,
        public readonly userId: string,
        public readonly kontrakId: string,
        public readonly periode: string,
        public readonly dueDate: string,
        public readonly amount: number,
        public readonly paymentDate?: string,
    ) {}
}

export class SalaryUpdateEvent {
    constructor(
        public readonly salaryId: string,
        public readonly userId: string,
        public readonly paymentDate: Date,
    ) {}
}
