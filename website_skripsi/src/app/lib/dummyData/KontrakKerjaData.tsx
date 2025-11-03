import { KontrakKerja, WorkStatus, MajorRole, MinorRole, Gaji, Project, KontrakKerjaStatus, GajiStatus } from "../types/types";

export const dummyKontrakKerja: KontrakKerja[] = [
  {
    id: "KK001",
    namaFreelance: "Rizky Adi",
    project: { projectId: "PRJ001", projectName: "Redesign Website Marketing", anggotaProject: [] },
    workStatus: WorkStatus.WFO,
    majorRole: MajorRole.KARYAWAN,
    minorRole: MinorRole.UI_UX,
    tanggalMulai: "2025-01-10",
    tanggalSelesai: "2025-03-30",
    password: "12345678",
    metodePembayaran: "DP+Final",
    dpPercentage: 10,
    finalPercentage: 90,
    totalBayaran: 15000000,
    absensiBulanan: 20,
    cutiBulanan: 2,
    pembayaran: [
        { 
            id: "PAY001", 
            name: "Termin 1", 
            month: "Januari", 
            dueDate: "2025-01-15", 
            paymentDate: "2025-01-14", 
            amount: 1500000, 
            status: GajiStatus.DIBAYAR 
        },
        { 
            id: "PAY002", 
            name: "Termin 2", 
            month: "Maret", 
            dueDate: "2025-03-30", 
            amount: 13500000, 
            status: GajiStatus.BELUM_DIBAYAR 
        },
    ],
    status: KontrakKerjaStatus.AKTIF,
    catatan: "Kontrak 3 bulan, pembayaran 10% DP dan 90% pelunasan setelah project selesai.",
  },
  {
    id: "KK002",
    namaFreelance: "Dinda Pratiwi",
    project: { projectId: "PRJ002", projectName: "Mobile App Internal Tools", anggotaProject: [] },
    workStatus: WorkStatus.HYBRID,
    majorRole: MajorRole.KARYAWAN,
    minorRole: MinorRole.FRONTEND,
    tanggalMulai: "2025-02-01",
    tanggalSelesai: "2025-05-30",
    password: "12345678",
    metodePembayaran: "Bulanan",
    totalBayaran: 20000000,
    absensiBulanan: 22,
    cutiBulanan: 1,
    pembayaran: [
        { 
            id: "PAY003", 
            name: "Termin 1", 
            month: "Maret", 
            dueDate: "2025-03-01", 
            paymentDate: "2025-03-02", 
            amount: 6666666, 
            status: GajiStatus.DIBAYAR 
        },
        { 
            id: "PAY004", 
            name: "Termin 2", 
            month: "April", 
            dueDate: "2025-04-01", 
            amount: 6666666, 
            status: GajiStatus.BELUM_DIBAYAR 
        },
        { 
            id: "PAY005", 
            name: "Termin 3", 
            month: "Mei", 
            dueDate: "2025-05-01", 
            amount: 6666666, 
            status: GajiStatus.BELUM_DIBAYAR 
        },
    ],
    status: KontrakKerjaStatus.AKTIF,
  },
  {
    id: "KK003",
    namaFreelance: "Andi Saputra",
    project: { projectId: "PRJ003", projectName: "Company Profile Website", anggotaProject: [] },
    workStatus: WorkStatus.WFH,
    majorRole: MajorRole.KARYAWAN,
    minorRole: MinorRole.BACKEND,
    tanggalMulai: "2024-09-01",
    tanggalSelesai: "2024-12-01",
    password: "12345678",
    metodePembayaran: "Per_Project",
    totalBayaran: 12000000,
    absensiBulanan: 0,
    cutiBulanan: 0,
    pembayaran: [
        { 
            id: "PAY006", 
            name: "Full Payment", 
            month: "Desember", 
            dueDate: "2024-12-01", 
            paymentDate: "2024-12-01", 
            amount: 12000000, 
            status: GajiStatus.DIBAYAR 
        },
    ],
    status: KontrakKerjaStatus.SELESAI,
  },
];
