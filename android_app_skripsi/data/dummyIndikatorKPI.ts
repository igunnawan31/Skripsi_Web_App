import { dummyJawabanKPI } from "./dummyJawabanKPI";
import { dummyPertanyaanKPI } from "./dummyPertanyaanKPI";
import { dummyUsers } from "./dummyUsers";

export enum StatusIndikatorKPI {
    DRAFT = "draft",
    AKTIF = "aktif",
    SELESAI = "selesai",
    ARSIP = "arsip",
}

export const dummyIndikatorKPI = {
    id: "I1",
    namaIndikator: "KPI Periode November 2025",
    deskripsi: "Penilaian performa anggota project selama bulan November",
    kategori: "Project Performance",

    periodeMulai: "2025-11-01",
    periodeBerakhir: "2025-11-30",

    pertanyaan: dummyPertanyaanKPI.filter((item) => item.IndikatorKPIId === "I1"),
    hasilPenilaian: dummyJawabanKPI.filter((item) => item.indikatorKPIId === "I1"),

    diisiOleh: [dummyUsers[0], dummyUsers[4]],
    pertanyaanUntuk: [
        dummyUsers[1],
        dummyUsers[2],
        dummyUsers[7],
        dummyUsers[5],
        dummyUsers[6],
    ],

    statusPublic: true,
    status: StatusIndikatorKPI.AKTIF,

    dibuatOleh: dummyUsers[3],
    dibuatTanggal: "2025-11-01",
};