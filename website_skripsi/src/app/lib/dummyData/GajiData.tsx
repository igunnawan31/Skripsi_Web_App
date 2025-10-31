import { Gaji, GajiStatus, MajorRole, MinorRole } from "../types/types";

export const dummyGaji: Gaji[] = [
    {
        id: "GJ-001",
        name: "Budi Santoso",
        month: "Oktober 2025",
        dueDate: "2025-10-25",
        paymentDate: null,
        status: GajiStatus.BELUM_DIBAYAR,
        amount: 8500000,
    },
    {
        id: "GJ-002",
        name: "Siti Rahmawati",
        month: "Oktober 2025",
        dueDate: "2025-10-22",
        paymentDate: "2025-10-20",
        status: GajiStatus.DIBAYAR,
        amount: 7800000,
    },
    {
        id: "GJ-003",
        name: "Andi Prasetyo",
        month: "September 2025",
        dueDate: "2025-09-25",
        paymentDate: null,
        status: GajiStatus.TERLAMBAT,
        amount: 6200000,
    },
    {
        id: "GJ-004",
        name: "Dewi Kartika",
        month: "Oktober 2025",
        dueDate: "2025-10-24",
        paymentDate: null,
        status: GajiStatus.BELUM_DIBAYAR,
        amount: 11000000,
    },
];
