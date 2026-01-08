// User
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

// Absensi 
export enum WorkStatus {
    WFH = "WFH",
    WFO = "WFO",
    HYBRID = "HYBRID",
}

// Cuti
export enum CutiStatus {
    MENUNGGU = "MENUNGGU",
    DITERIMA = "DITERIMA",
    DITOLAK = "DITOLAK",
    BATAL = "BATAL",
    EXPIRED = "EXPIRED",
}

// Gaji
export enum GajiStatus {
    BELUM_DIBAYAR = "Belum Dibayar",
    DIBAYAR = "Sudah Dibayar",
    TERLAMBAT = "Terlambat Membayar"
}


// Kontrak
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

export enum EmployeeType {
    CONTRACT = "CONTRACT",
    PERMANENT = "PERMANENT",
}

// KPI
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