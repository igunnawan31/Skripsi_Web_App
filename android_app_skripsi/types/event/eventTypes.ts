import { ProjectStatus } from "../project/projectTypes";

export enum EventFreq {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY"
}

export enum EventStatus {
    UPCOMING = "UPCOMING",
    COMPLETED = "COMPLETED",
    CANCELLED = "MONTHLY"
}


export type EventResponse = {
    id: string,
    title: string,
    eventDate: string,
    projectId: string,
    status: EventStatus,
    frequency: EventFreq,
    timezone: string,
    createdAt: string,
    updatedAt: string,
    project: {
        id: string,
        name: string,
        description: string,
        startDate: string,
        endDate: string,
        status: ProjectStatus.ACTIVE,
        documents: File | null,
        createdAt: string,
        updatedAt: string
    },
    occurrences: [
        {
            id: string,
            agendaId: string,
            date: string,
            isCancelled: boolean
        }
    ]
};

export type FormDataEvent = {
    title: string,
    date: string,
    time: string,
    projectId?: string | null,
    frequency?: EventFreq | null, 
}

export type CreateEventRequest = {
    title: string,
    eventDate: string,
    projectId?: string | null,
    frequency?: EventFreq | null, 
}

export type UpdateOccurrences = {
    date: string,
    isCancelled: boolean
}
