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
        pertanyaan: "Apakah karyawan dapat bekerja sama dalam tim?",
        bobot: 1,
        aktif: true,
        skalaNilai: dummySkalaNilai,
        defaultRange: [1, 5],
        IndikatorKPIId: "I1",
    },
];