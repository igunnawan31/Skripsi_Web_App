export type Absensi = {
    id: string;
    name: string;
    workStatus: "Work From Home" | "Work From Office" | "Hybrid";
    majorRole: string;
    minorRole: string;
    date: string;
    checkIn: string;
    checkOut: string;
}

export type Cuti = {
    id: string;
    name: string;
    branch: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    majorRole: string;
    minorRole: string;
    status: "Menunggu" | "Diterima" | "Ditolak";
    approver: string;
    submissionDate: string;
};
