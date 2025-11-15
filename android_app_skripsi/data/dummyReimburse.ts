export enum ReimburseStatus {
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
        reimburseStatus: ReimburseStatus.DITOLAK,
        approver: "Admin - Aldisar Gibran",
        approvalDate: "22-11-2025",
        alasanPenolakan: "Ditolak karena tidak ada buktinya",
        file: "",
    },
    {
        id: "Reimburse-002-Muhamad_Gunawan",
        name: "Muhamad Gunawan",
        submissionDate: "21-11-2025",
        totalPengeluaran: 200000,
        majorRole: "Karyawan",
        minorRole: "Backend Developer",
        reimburseStatus: ReimburseStatus.DITOLAK,
        approver: "Admin - Aldisar Gibran",
        approvalDate: "23-11-2025",
        alasanPenolakan: "Ditolak karena bon tidak sesuai dengan jumlah pengajuannya",
        file: "",
    },
];