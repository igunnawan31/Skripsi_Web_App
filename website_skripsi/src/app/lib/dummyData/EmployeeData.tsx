export const employeeData: Record<
    string, { columns: string[]; rows: Record<string, string>[] }
> = {
    Kehadiran: {
        columns: ["Nama", "Posisi", "Status", "Persentase"],
        rows: [
            { Nama: "Alice", Posisi: "Engineer", Status: "Aktif", Persentase: "98%" },
            { Nama: "Bob", Posisi: "Designer", Status: "Aktif", Persentase: "96%" },
            { Nama: "Carol", Posisi: "HR", Status: "Non-Aktif", Persentase: "80%" },
        ],
    },
    Absensi: {
        columns: ["Nama", "Tanggal", "Keterangan"],
        rows: [
            { Nama: "Bob", Tanggal: "2025-10-21", Keterangan: "Sakit" },
            { Nama: "Carol", Tanggal: "2025-10-20", Keterangan: "Izin" },
        ],
    },
    Kontrak: {
        columns: ["Nama", "Departemen", "Jenis Kontrak", "Berakhir"],
        rows: [
            { Nama: "David", Departemen: "IT", "Jenis Kontrak": "Full-Time", Berakhir: "2026-05-30" },
        ],
    },
    Gaji: {
        columns: ["Nama", "Departemen", "Gaji Bulanan", "Perubahan"],
        rows: [
            { Nama: "Ella", Departemen: "Operasional", "Gaji Bulanan": "Rp 8.230.000", Perubahan: "+5.4%" },
            { Nama: "Alice", Departemen: "IT", "Gaji Bulanan": "Rp 7.500.000", Perubahan: "+3.2%" },
        ],
    },
    Cuti: {
        columns: ["Nama", "Departemen", "Tanggal Mulai", "Tanggal Selesai", "Alasan"],
        rows: [
            {
                Nama: "Carol",
                Departemen: "HR",
                "Tanggal Mulai": "2025-10-10",
                "Tanggal Selesai": "2025-10-15",
                Alasan: "Cuti tahunan",
            },
        ],
    },
    Lembur: {
        columns: ["Nama", "Departemen", "Durasi", "Tanggal"],
        rows: [
            { Nama: "Bob", Departemen: "Creative", Durasi: "3 jam", Tanggal: "2025-10-18" },
        ],
    },
};