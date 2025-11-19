import { dummySkalaNilai } from "./dummySkalaNilai";

export enum KategoriPertanyaanKPI {
    KINERJA = "Kinerja Karyawan",
    SIFAT = "Sifat Karyawan"
}

export const dummyPertanyaanKPI = [
    {
        id: "Q1",
        kategoriPertanyaan: KategoriPertanyaanKPI.KINERJA,
        pertanyaan: "Bagaimana kualitas hasil kerja karyawan?",
        bobot: 1,
        aktif: true,
        skalaNilai: dummySkalaNilai,
        defaultRange: [1, 5],
        IndikatorKPIId: "I1",
    },
    {
        id: "Q2",
        kategoriPertanyaan: KategoriPertanyaanKPI.SIFAT,
        pertanyaan: "Apakah karyawan dapat bekerja sama dalam tim project anda?",
        bobot: 1,
        aktif: true,
        skalaNilai: dummySkalaNilai,
        defaultRange: [1, 5],
        IndikatorKPIId: "I1",
    },
    {
        id: "Q3",
        kategoriPertanyaan: KategoriPertanyaanKPI.SIFAT,
        pertanyaan: "Bagaimana?",
        bobot: 1,
        aktif: true,
        skalaNilai: dummySkalaNilai,
        defaultRange: [1, 5],
        IndikatorKPIId: "I1",
    },
    {
        id: "Q4",
        kategoriPertanyaan: KategoriPertanyaanKPI.SIFAT,
        pertanyaan: "Bagaimana adsada?",
        bobot: 1,
        aktif: true,
        skalaNilai: dummySkalaNilai,
        defaultRange: [1, 5],
        IndikatorKPIId: "I1",
    },
    {
        id: "Q5",
        kategoriPertanyaan: KategoriPertanyaanKPI.SIFAT,
        pertanyaan: "Bagaimana asa?",
        bobot: 1,
        aktif: true,
        skalaNilai: dummySkalaNilai,
        defaultRange: [1, 5],
        IndikatorKPIId: "I1",
    },
];