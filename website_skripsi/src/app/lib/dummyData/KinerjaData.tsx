import { IndikatorKPI, KategoriPertanyaanKPI, StatusIndikatorKPI, StatusPublicKPI } from "../types/types";
import { dummyUsers } from "./dummyUsers";
import { PenilaianKPIData } from "./PenilaianKPIData";
import { PertanyaanKPIData } from "./PertanyaanKPIData";

export const KinerjaData: IndikatorKPI[] = [
    {
        id: "I1",
        namaIndikator: "KPI Periode November 2025",
        deskripsi: "Penilaian performa anggota project selama bulan November",
        kategori: KategoriPertanyaanKPI.KINERJA,

        periodeMulai: "2025-11-01",
        periodeBerakhir: "2025-11-30",

        pertanyaan: PertanyaanKPIData.filter((item) => item.IndikatorKPIId === "I1"),
        hasilPenilaian: PenilaianKPIData.filter((item) => item.indikatorKPIId === "I1"),

        diisiOleh: [
            dummyUsers[2]
        ],
        pertanyaanUntuk: [
            dummyUsers[3],
            dummyUsers[4],
            dummyUsers[5],
        ],

        statusPublic: StatusPublicKPI.PUBLIC,
        status: StatusIndikatorKPI.AKTIF,

        dibuatOleh: dummyUsers[1],
        dibuatTanggal: "2025-11-01",
    },
    {
        id: "I2",
        namaIndikator: "KPI Periode Desember 2025",
        deskripsi: "Penilaian performa anggota project selama bulan Desember",
        kategori: KategoriPertanyaanKPI.SIFAT,

        periodeMulai: "2025-12-01",
        periodeBerakhir: "2025-12-31",

        pertanyaan: PertanyaanKPIData.filter((item) => item.IndikatorKPIId === "I2"),
        hasilPenilaian: PenilaianKPIData.filter((item) => item.indikatorKPIId === "I2"),

        diisiOleh: [
            dummyUsers[2],
            dummyUsers[1],
        ],
        pertanyaanUntuk: [
            dummyUsers[6],
            dummyUsers[7],
            dummyUsers[8],
            dummyUsers[9],
            dummyUsers[10],
        ],

        statusPublic: StatusPublicKPI.PRIVATE,
        status: StatusIndikatorKPI.AKTIF,

        dibuatOleh: dummyUsers[1],
        dibuatTanggal: "2025-11-01",
    },
]