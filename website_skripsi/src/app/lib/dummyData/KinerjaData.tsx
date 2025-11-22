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

        pertanyaan: [
            PertanyaanKPIData[0],
            PertanyaanKPIData[1],
            PertanyaanKPIData[2]
        ],
        hasilPenilaian: [
            PenilaianKPIData[0],
        ],

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

        periodeMulai: "2025-11-01",
        periodeBerakhir: "2025-11-30",

        pertanyaan: [
            PertanyaanKPIData[3],
            PertanyaanKPIData[4],
            PertanyaanKPIData[5]
        ],
        hasilPenilaian: [
            PenilaianKPIData[0],
        ],

        diisiOleh: [
            dummyUsers[2],
        ],
        pertanyaanUntuk: [
            dummyUsers[6],
            dummyUsers[7],
            dummyUsers[8],
        ],

        statusPublic: StatusPublicKPI.PRIVATE,
        status: StatusIndikatorKPI.AKTIF,

        dibuatOleh: dummyUsers[1],
        dibuatTanggal: "2025-11-01",
    },
]