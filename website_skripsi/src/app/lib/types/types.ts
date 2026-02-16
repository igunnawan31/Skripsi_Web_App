// Response Type
export enum MajorRole {
    OWNER = "OWNER",
    KARYAWAN = "KARYAWAN",
}

export enum MinorRole {
    HR = "HR",
    ADMIN = "ADMIN",
    PROJECT_MANAGER = "PROJECT_MANAGER",
    UI_UX = "UI_UX",
    FRONTEND = "FRONTEND",
    BACKEND = "BACKEND",
}

export enum WorkStatus {
    WFH = "Work From Home",
    WFO = "Work From Office",
    HYBRID = "Hybrid",
}

export enum CutiStatus {
    MENUNGGU = "MENUNGGU",
    DITERIMA = "DITERIMA",
    DITOLAK = "DITOLAK",
    BATAL = "BATAL",
    EXPIRED = "EXPIRED",
}

export enum GajiStatus {
    BELUM_DIBAYAR = "Belum Dibayar",
    DIBAYAR = "Sudah Dibayar",
    TERLAMBAT = "Terlambat Membayar"
}

export enum KontrakKerjaStatus {
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    ON_HOLD = "ON_HOLD",
}

export enum MetodePembayaran {
    MONTHLY = "MONTHLY",
    TERMIN = "TERMIN",
    FULL = "FULL",
}

export enum KategoriPertanyaanKPI {
    KINERJA = "Kinerja Karyawan",
    SIFAT = "Sifat Karyawan"
}

export enum StatusIndikatorKPI {
    DRAFT = "draft",
    AKTIF = "aktif",
    SELESAI = "selesai",
    ARSIP = "arsip",
}

export enum StatusPublicKPI {
    PUBLIC = "Public",
    PRIVATE = "Private"
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
    ketuaProject?: User;
    anggotaProject?: User[];
}

export type User = {
    id: string;
    email: string;
    name: string;
    majorRole: MajorRole;
    minorRole?: MinorRole;
    photo: JSON;
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
    workStatus: WorkStatus | null;
    majorRole: MajorRole;
    minorRole: MinorRole;
    tanggalMulai: string;
    tanggalSelesai: string;
    password: string; // Secara default adalah 12345678, nanti si orangnya ngubah sendiri dari forgot password

    metodePembayaran: "Bulanan" | "DP+Final" | "Per_Project";
    dpPercentage?: number;
    finalPercentage?: number;
    totalBayaran: number;
    absensiBulanan: number;
    cutiBulanan: number;

    pembayaran: Gaji[];
    status: KontrakKerjaStatus;
    catatan?: string;
    kontrakKerjaPDF?: string;
}

export type SkalaNilaiKPI = {
    nilai: number;             // misalnya 1, 2, 3, 4, 5
    label: string;             // misalnya "Sangat Tidak Baik", "Tidak Baik", dst
    deskripsi?: string;        // opsional: penjelasan tambahan
};

export type pertanyaanKPI = {
    id: string;
    kategoriPertanyaan: KategoriPertanyaanKPI;
    pertanyaan: string;

    bobot: number;             // bobot tiap pertanyaan
    aktif: boolean;            // apakah pertanyaan ini digunakan

    skalaNilai: SkalaNilaiKPI[];  // daftar pilihan nilai 1–5
    defaultRange?: number[];      // misal [1, 5] — bisa bantu validasi range

    IndikatorKPIId: string;    // relasi dengan IndikatorKPI
};

export type JawabanKPI = {
    id: string;
    penilai: User;
    dinilai: User;
    nilai: number;
    notes?: string;
    tanggalIsi: string;

    pertanyaanId: string; // Relasi dengan PertanyaanKPI
    indikatorKPIId: string;
};

export type IndikatorKPI = {
    id: string;
    namaIndikator: string;
    deskripsi?: string;
    kategori?: string;

    periodeMulai: string; // Mulai Pengisian Indikator KPI
    periodeBerakhir: string; // Berakhir Pengisian Indikator KPI

    pertanyaan: pertanyaanKPI[];
    hasilPenilaian?: JawabanKPI[];
    rekapPerUser?: RekapKPI[];

    diisiOleh: User[];
    pertanyaanUntuk: User[];

    statusPublic: StatusPublicKPI; // apakah bisa diakses oleh penilai
    status: StatusIndikatorKPI;

    dibuatOleh?: User; // pembuat template KPI
    dibuatTanggal?: string;
}

export type RekapKPI = {
    id: string;
    indikatorId: string;
    userDinilai: User; // Karyawan yang dinilai

    totalNilai: number; // Total dari semua penilai
    rataRataNilai: number; // totalNilai / jumlahPertanyaan
    jumlahPenilai: number; // misal 3 orang
    jumlahPertanyaan: number;
};

export type RekapKPIAll = {
    id: string;
    userDinilai: User;              // karyawan yang dinilai
    totalNilaiKeseluruhan: number;  // akumulasi dari seluruh RekapKPI individu
    rataRataNilaiKeseluruhan: number; // rata-rata lintas semua periode
    jumlahPeriode: number;          // berapa banyak periode diakumulasikan

    detailPeriode: RekapKPI[];      // detail setiap periode (misal Q1, Q2, Q3)
};

// FORM
export type IndikatorKPIForm = {
    namaIndikator: string;
    deskripsi?: string;
    kategori: string;

    periodeMulai: string; // Mulai Pengisian Indikator KPI
    periodeBerakhir: string; // Berakhir Pengisian Indikator KPI

    pertanyaan: pertanyaanKPI[];
    hasilPenilaian?: JawabanKPI[];
    rekapPerUser?: RekapKPI[];

    diisiOleh: User[];
    pertanyaanUntuk: User[];

    statusPublic: StatusPublicKPI; // apakah bisa diakses oleh penilai
    status: StatusIndikatorKPI;

    dibuatOleh?: User; // pembuat template KPI
    dibuatTanggal?: string;
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
    kontrakKerjaPDF?: string;
}

export type UserForm = {
    email: string;
    password: string;
    nama: string;
    majorRole: MajorRole;
    minorRole?: MinorRole;
    tanggalMulai: string;
    tanggalSelesai: string;
    projectList: Project[];
}