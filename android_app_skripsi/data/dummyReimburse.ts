export enum CutiStatus {
    DITERIMA = "Reimburse Diterima",
    DITOLAK = "Reimburse Ditolak",
    MENUNGGU = "Menunggu Jawaban",
}

export const dummyReimburse = [
    {
        id: "Reimburse-001-Muhamad_Gunawan",
        name: "Muhamad Gunawan",
        submissionDate: "20-11-2025",
        totalPengeluaran: 100000,
        majorRole: "Karyawan",
        minorRole: "Backend Developer",
        cutiStatus: CutiStatus.DITOLAK,
        approver: "Admin - Aldisar Gibran",
        file: "",
    },
    {
        id: "Reimburse-002-Muhamad_Gunawan",
        name: "Muhamad Gunawan",
        submissionDate: "21-11-2025",
        totalPengeluaran: 200000,
        majorRole: "Karyawan",
        minorRole: "Backend Developer",
        cutiStatus: CutiStatus.DITOLAK,
        approver: "Admin - Aldisar Gibran",
        file: "",
    },
];