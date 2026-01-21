import { ProjectStatus } from "../fixTypes"

export enum AgendaFreq {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY"
}

export enum AgendaStatus {
    UPCOMING = "UPCOMING",
    COMPLETED = "COMPLETED",
    CANCELLED = "MONTHLY"
}

export type AgendaResponse = {
    id: string,
    title: string,
    eventDate: string,
    projectId: string,
    status: AgendaStatus,
    frequency: AgendaFreq,
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

export type FormDataAgenda = {
    title: string,
    date: string,
    time: string,
    projectId?: string | null,
    frequency?: AgendaFreq | null, 
}

export type CreateAgenda = {
    title: string,
    eventDate: string,
    projectId?: string | null,
    frequency?: AgendaFreq | null, 
}

export type UpdateOccurrences = {
    date: string,
    isCancelled: boolean
}
