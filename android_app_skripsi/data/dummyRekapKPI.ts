import { dummyUsers } from "./dummyUsers";

export const dummyRekapKPIAll = [
    {
        id: "rekap-001",
        userDinilai: dummyUsers[1],
        totalNilaiKeseluruhan: 250,
        rataRataNilaiKeseluruhan: 83.3,
        jumlahPeriode: 3,
        detailPeriode: [
            {
                id: "I1-Januari-2025",
                indikatorKPIId: "I1",
                userDinilai: dummyUsers[1],
                totalNilai: 90,
                rataRataNilai: 4.5,
                jumlahPenilai: 3,
                jumlahPertanyaan: 20,
                status: "available"
            },
            {
                id: "I2-Februari-2025",
                indikatorKPIId: "I2",
                userDinilai: dummyUsers[1],
                totalNilai: 0,
                rataRataNilai: 0,
                jumlahPenilai: 0,
                jumlahPertanyaan: 20,
                status: "pending"
            },
            {
                id: "I3-Februari-2025",
                indikatorKPIId: "I3",
                userDinilai: dummyUsers[1],
                totalNilai: 0,
                rataRataNilai: 0,
                jumlahPenilai: 0,
                jumlahPertanyaan: 20,
                status: "not_available"
            },
        ]
    },
    {
        id: "rekap-002",
        userDinilai: dummyUsers[1],
        totalNilaiKeseluruhan: 250,
        rataRataNilaiKeseluruhan: 83.3,
        jumlahPeriode: 3,
        detailPeriode: [
            {
                id: "I1-Januari-2025",
                indikatorKPIId: "I1",
                userDinilai: dummyUsers[0],
                totalNilai: 90,
                rataRataNilai: 4.5,
                jumlahPenilai: 3,
                jumlahPertanyaan: 20,
                status: "available"
            },
            {
                id: "I2-Februari-2025",
                indikatorKPIId: "I2",
                userDinilai: dummyUsers[0],
                totalNilai: 0,
                rataRataNilai: 0,
                jumlahPenilai: 0,
                jumlahPertanyaan: 20,
                status: "available"
            },
            {
                id: "I3-Februari-2025",
                indikatorKPIId: "I3",
                userDinilai: dummyUsers[0],
                totalNilai: 0,
                rataRataNilai: 0,
                jumlahPenilai: 0,
                jumlahPertanyaan: 20,
                status: "not_available"
            },
        ]
    }
];
