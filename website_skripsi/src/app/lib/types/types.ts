// Response Type
export enum MajorRole {
    OWNER = "Owner",
    KARYAWAN = "Karyawan",
}

export enum MinorRole {
    HR = "Human Resource",
    ADMIN = "Admin",
    PROJECT_MANAGER = "Project Manager",
    UI_UX = "UI/UX Engineer",
    FRONTEND = "Frontend Developer",
    BACKEND = "Backend Developer",
}

export enum WorkStatus {
    WFH = "Work From Home",
    WFO = "Work From Office",
    HYBRID = "Hybrid",
}

export enum CutiStatus {
    MENUNGGU = "Menunggu Konfirmasi",
    DITERIMA = "Cuti Diterima",
    DITOLAK = "Cuti Ditolak"
}

export enum GajiStatus {
    BELUM_DIBAYAR = "Belum Dibayar",
    DIBAYAR = "Sudah Dibayar",
    TERLAMBAT = "Terlambat Membayar"
}

export enum KontrakKerjaStatus {
    AKTIF = "Aktif",
    SELESAI = "Selesai",
}

export type Absensi = {
    id: string;
    name: string;
    workStatus: WorkStatus;
    majorRole: MajorRole;
    minorRole: MinorRole;
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
    status: CutiStatus;
    approver: string;
    submissionDate: string;
};

export type Project = {
    projectId: string;
    projectName: string;
    anggotaProject: User[];
}

export type User = {
    id: string;
    email: string;
    password: string;
    nama: string;
    majorRole: string;
    minorRole: string;
    tanggalMulai: string;
    tanggalSelesai: string;
}

export type Gaji = {
    id: string;
    name: string;
    month: string;
    dueDate: string;
    paymentDate?: string | null;
    amount: number;
    status: GajiStatus;
};

export type KontrakKerja = {
    id: string;
    namaFreelance: string;
    project: Project | null;
    majorRole: MajorRole;
    minorRole: MinorRole;
    tanggalMulai: string;
    tanggalSelesai: string;
    password: string; // Secara default adalah 12345678, nanti si orangnya ngubah sendiri dari forgot password

    metodePembayaran: "Bulanan" | "Termin" | "Full";
    totalBayaran: number;
    absensiBulanan: number;
    cutiBulanan: number;

    pembayaran: Gaji[];
    status: KontrakKerjaStatus;
    catatan?: string;
}

export type KontrakKerjaForm = {
    namaFreelance: string;
    project: Project | null;
    workStatus: WorkStatus | null;
    majorRole: MajorRole | null;
    minorRole: MinorRole | null;
    tanggalMulai: string;
    tanggalSelesai: string;
    password: string;

    metodePembayaran: "Bulanan" | "DP+Final" | "Per_Project";
    dpPercentage?: number;
    finalPercentage?: number;
    totalBayaran: number;
    absensiBulanan: number;
    cutiBulanan: number;

    pembayaran: Gaji[];
    status: KontrakKerjaStatus; 
    catatan?: string;
}