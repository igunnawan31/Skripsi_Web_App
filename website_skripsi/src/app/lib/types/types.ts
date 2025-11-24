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
    password: string;
    nama: string;
    majorRole: MajorRole;
    minorRole?: MinorRole;
    tanggalMulai: string;
    tanggalSelesai: string;
    projectList: Project[];
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

export type LayerPenilaian = {
    id: string;
    majorRolePenilai: MajorRole;       // Role yang memberi nilai
    minorRolePenilai?: MinorRole;
    menilaiRole: MinorRole[];     // Role yang bisa dinilai oleh rolePenilai
    hanyaDalamProject?: boolean;  // true = hanya berlaku untuk anggota project
};

export const layerPenilaian: LayerPenilaian[] = [
    {
        id: "L1",
        majorRolePenilai: MajorRole.OWNER,
        menilaiRole: [MinorRole.HR, MinorRole.PROJECT_MANAGER],
    },
    {
        id: "L2",
        majorRolePenilai: MajorRole.KARYAWAN,
        minorRolePenilai: MinorRole.HR,
        menilaiRole: [MinorRole.ADMIN],
    },
    {
        id: "L3",
        majorRolePenilai: MajorRole.KARYAWAN,
        minorRolePenilai: MinorRole.PROJECT_MANAGER,
        menilaiRole: [
            MinorRole.UI_UX,
            MinorRole.FRONTEND,
            MinorRole.BACKEND
        ],
        hanyaDalamProject: true,
    },
];
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