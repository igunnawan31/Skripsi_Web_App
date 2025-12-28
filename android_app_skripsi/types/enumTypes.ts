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