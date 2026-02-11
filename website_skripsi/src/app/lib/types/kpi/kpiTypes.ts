import { User } from "../types"

export enum StatusIndikatorKPI {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    ARCHIVED = "ARCHIVED",
}

export enum KategoriPertanyaanKPI {
    KINERJA = "KINERJA",
    SIFAT = "SIFAT",
}

export const SkalaNilai = [
    { nilai: 1, label: "Sangat Buruk" },
    { nilai: 2, label: "Buruk" },
    { nilai: 3, label: "Cukup" },
    { nilai: 4, label: "Baik" },
    { nilai: 5, label: "Sangat Baik" },
];

export type PertanyaanIndikatorResponse = {
    id: string,
    indikatorId: string,
    kategori: KategoriPertanyaanKPI,
    pertanyaan: string,
    bobot: number,
    aktif: boolean,
    urutanSoal: number,
    createdAt: string,
    updatedAt: string
}

export type JawabanIndikatorResponse = {
    id: string,
    indikatorId: string,
    pertanyaanId: string,
    nilai: number,
    notes: string,
    createdAt: string,
    updatedAt: string
}

export type RekapIndikatorResponse = {
    id: string,
    indikatorId: string,
    userId: string,
    totalNilai: number,
    rataRata: number,
    jumlahPenilai: number,
    keterangan: string | null,
    createdAt: string,
    updatedAt: string,
}

export type IndikatorResponse = {
    id: string,
    name: string,
    description: string,
    startDate: string,
    endDate: string,
    statusPublic: boolean,
    status: StatusIndikatorKPI,
    createdById: string,
    createdAt: string,
    updatedAt: string,
    createdBy: User,
    pertanyaan: PertanyaanIndikatorResponse[] | null,
    jawaban: JawabanIndikatorResponse[] | null, 
    rekap: RekapIndikatorResponse[] | null
}