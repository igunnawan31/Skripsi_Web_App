export enum ProjectStatus {
    ACTIVE = "ACTIVE",
    ON_HOLD = "ON_HOLD",
    COMPLETED = "COMPLETED",
}

export type RequestProject = {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
}

export type ResponseProject = {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: ProjectStatus;
    createdAt: string;
    updatedAt: string;
}