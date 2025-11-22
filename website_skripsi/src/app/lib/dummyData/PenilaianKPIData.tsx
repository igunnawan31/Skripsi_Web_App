import { JawabanKPI } from "../types/types";
import { dummyUsers } from "./dummyUsers";

export const PenilaianKPIData: JawabanKPI[] = [
    {
        id: "J1",
        penilai: dummyUsers[2],
        dinilai: dummyUsers[3],
        nilai: 4,
        notes: "Kerja bagus, cepat tanggap",
        tanggalIsi: "2025-11-05",
        PertanyaanId: "Q1",
    },
    {
        id: "J2",
        penilai: dummyUsers[2],
        dinilai: dummyUsers[3],
        nilai: 5,
        notes: "Sangat kooperatif",
        tanggalIsi: "2025-11-05",
        PertanyaanId: "Q2",
    },
    {
        id: "J3",
        penilai: dummyUsers[2],
        dinilai: dummyUsers[3],
        nilai: 5,
        notes: "Sangat kooperatif",
        tanggalIsi: "2025-11-05",
        PertanyaanId: "Q3",
    },
]