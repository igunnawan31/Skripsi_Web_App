export enum ProjectStatus {
    ACTIVE = "ACTIVE",
    ON_HOLD = "ON_HOLD",
    COMPLETED = "COMPLETED",
}

export enum ProjectRole {
    KETUA = "KETUA",
    ANGGOTA = "ANGGOTA",
}

export type ProjectTeams = {
    projectId: string,
    userId: string,
    role: ProjectRole,
}

export type ProjectResponse = {
    id: string,
    name: string,
    description: string,
    startDate: string,
    endDate: string,
    status: ProjectStatus,
    documents: File | null,
    createdAt: string,
    updatedAt: string,
    projectTeams: ProjectTeams[],
}