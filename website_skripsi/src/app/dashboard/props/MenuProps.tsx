import { icons } from "@/app/lib/assets/assets"

export interface MenuItem {
    title: string;
    description?: string;
    href?: string;
    items: Array<{
        icon: string;
        alt: string;
        label: string;
        description: string;
        href: string;
    }>;
}

export const HRMenuProps = [
    {
        title: "Dashboard",
        items: [
            {
                icon: icons.homeLogo,
                alt: "Dashboard",
                label: "Dashboard",
                description: "Lihat ringkasan data HRIS seperti kehadiran, absensi, kontrak, dan kinerja karyawan secara real-time.",
                href: "/dashboard",
            },
        ],
    },
    {
        title: "Manage Absensi",
        items: [
            {
                icon: icons.absensiLogo,
                alt: "Absensi",
                label: "Absensi Karyawan",
                description: "Kelola dan pantau data kehadiran karyawan, termasuk waktu masuk, keluar, dan status kehadiran harian.",
                href: "/dashboard/absensi-karyawan",
            },
        ],
    },
    {
        title: "Manage Cuti",
        items: [
            {
                icon: icons.cutiLogo,
                alt: "Cuti",
                label: "Cuti Karyawan",
                description: "Atur dan pantau pengajuan cuti karyawan berdasarkan hak cuti, tanggal, serta status persetujuan.",
                href: "/dashboard/cuti-karyawan",
            },
        ],
    },
    {
        title: "Manage Gaji",
        items: [
            {
                icon: icons.gajiLogo,
                alt: "Gaji",
                label: "Gaji Karyawan",
                description: "Kelola data penggajian, potongan, tunjangan, dan riwayat pembayaran untuk seluruh karyawan.",
                href: "/dashboard/gaji-karyawan",
            },
        ],
    },
    {
        title: "Manage Kontrak Kerja",
        items: [
            {
                icon: icons.kontrakKerjaLogo,
                alt: "Kontrak Kerja",
                label: "Kontrak Kerja Karyawan",
                description: "Pantau masa berlaku kontrak, perpanjangan, dan riwayat status kerja karyawan dalam satu tempat.",
                href: "/dashboard/kontrak-kerja-karyawan",
            },
        ],
    },
    {
        title: "Manajemen Kinerja Karyawan",
        items: [
            {
                icon: icons.indikatorKPILogo,
                alt: "Manajemen Indikator Kinerja Karyawan",
                label: "Manajemen Indikator Kinerja Karyawan",
                description: "Tetapkan indikator KPI dan metrik penilaian untuk mengukur performa karyawan secara objektif.",
                href: "/dashboard/manajemen-kpi/manajemen-indikator-kinerja-karyawan",
            },
            {
                icon: icons.penilaianKPILogo,
                alt: "Penilaian Kinerja Karyawan",
                label: "Penilaian Kinerja Karyawan",
                description: "Lakukan penilaian kinerja berdasarkan indikator yang telah ditetapkan untuk setiap karyawan.",
                href: "/dashboard/manajemen-kpi/penilaian-kinerja-karyawan",
            },
            {
                icon: icons.hasilKPILogo,
                alt: "Hasil Kinerja Karyawan",
                label: "Hasil Kinerja Karyawan",
                description: "Lihat hasil evaluasi kinerja karyawan dalam bentuk laporan dan grafik perkembangan performa.",
                href: "/dashboard/manajemen-kpi/hasil-kinerja-karyawan",
            },
        ],
    },
    {
        title: "Manajemen Karyawan",
        items: [
            {
                icon: icons.manajemenKaryawanLogo,
                alt: "Manajemen Karyawan",
                label: "Manajemen Karyawan",
                description: "Kelola profil, jabatan, status kerja, dan riwayat data karyawan secara terpusat dan efisien.",
                href: "/dashboard/manajemen-karyawan",
            },
        ],
    },
    {
        title: "Laporan Perusahaan",
        items: [
            {
                icon: icons.rekapAbsensiKaryawanLogo,
                alt: "Rekap Absensi Karyawan",
                label: "Rekap Absensi Karyawan",
                description: "Tinjau laporan rekapitulasi absensi karyawan untuk analisis kehadiran bulanan atau tahunan.",
                href: "/dashboard/rekap-absensi-karyawan",
            },
            {
                icon: icons.rekapCutiKaryawanLogo,
                alt: "Rekap Cuti Karyawan",
                label: "Rekap Cuti Karyawan",
                description: "Lihat rekap cuti karyawan berdasarkan jenis cuti, periode waktu, dan status pengajuan.",
                href: "/dashboard/rekap-cuti-karyawan",
            },
            {
                icon: icons.rekapGajiKaryawanLogo,
                alt: "Rekap Gaji Karyawan",
                label: "Rekap Gaji Karyawan",
                description: "Tampilkan laporan penggajian untuk seluruh karyawan sebagai dasar evaluasi keuangan perusahaan.",
                href: "/dashboard/rekap-gaji-karyawan",
            },
            {
                icon: icons.rekapKPIKaryawanLogo,
                alt: "Rekap Kinerja Karyawan",
                label: "Rekap Kinerja Karyawan",
                description: "Pantau performa keseluruhan karyawan berdasarkan hasil KPI dan evaluasi manajerial.",
                href: "/dashboard/rekap-kinerja-karyawan",
            },
        ],
    },
    {
        title: "Lain-lainnya",
        items: [
            {
                icon: icons.indikatorKPILogo,
                alt: "Manajemen Project",
                label: "Manajemen Project",
                description: "Atur dan pantau pengajuan cuti karyawan berdasarkan hak cuti, tanggal, serta status persetujuan.",
                href: "/dashboard/manajemen-project",
            },
            {
                icon: icons.penilaianKPILogo,
                alt: "My Profile",
                label: "My Profile",
                description: "",
                href: "/dashboard/profile",
            },
        ],
    },
];

export const OwnerMenuProps = [
    {
        title: "Dashboard",
        items: [
            {
                icon: icons.homeLogo,
                alt: "Dashboard",
                label: "Dashboard",
                description: "Lihat ringkasan data HRIS seperti kehadiran, absensi, kontrak, dan kinerja karyawan secara real-time.",
                href: "/dashboard",
            },
        ],
    },
    {
        title: "Manage Cuti",
        items: [
            {
                icon: icons.cutiLogo,
                alt: "Cuti",
                label: "Cuti Karyawan",
                description: "Atur dan pantau pengajuan cuti karyawan berdasarkan hak cuti, tanggal, serta status persetujuan.",
                href: "/dashboard/cuti-karyawan-owner",
            },
        ],
    },
    {
        title: "Manage Gaji",
        items: [
            {
                icon: icons.gajiLogo,
                alt: "Gaji",
                label: "Gaji Karyawan",
                description: "Kelola data penggajian, potongan, tunjangan, dan riwayat pembayaran untuk seluruh karyawan.",
                href: "/dashboard/gaji-karyawan-owner",
            },
        ],
    },
    {
        title: "Manage Kontrak Kerja",
        items: [
            {
                icon: icons.kontrakKerjaLogo,
                alt: "Kontrak Kerja",
                label: "Kontrak Kerja Karyawan",
                description: "Pantau masa berlaku kontrak, perpanjangan, dan riwayat status kerja karyawan dalam satu tempat.",
                href: "/dashboard/kontrak-kerja-karyawan-owner",
            },
        ],
    },
    {
        title: "Manajemen Kinerja Karyawan For Owner",
        items: [
            {
                icon: icons.penilaianKPILogo,
                alt: "Penilaian Kinerja Karyawan",
                label: "Penilaian Kinerja Karyawan",
                description: "Lakukan penilaian kinerja berdasarkan indikator yang telah ditetapkan untuk setiap karyawan.",
                href: "/dashboard/manajemen-kpi-owner/penilaian-kinerja-karyawan",
            },
            {
                icon: icons.hasilKPILogo,
                alt: "Hasil Kinerja Karyawan",
                label: "Hasil Kinerja Karyawan",
                description: "Lihat hasil evaluasi kinerja karyawan dalam bentuk laporan dan grafik perkembangan performa.",
                href: "/dashboard/manajemen-kpi-owner/hasil-kinerja-karyawan",
            },
        ],
    },
    {
        title: "Manajemen Karyawan",
        items: [
            {
                icon: icons.manajemenKaryawanLogo,
                alt: "Manajemen Karyawan",
                label: "Manajemen Karyawan",
                description: "Kelola profil, jabatan, status kerja, dan riwayat data karyawan secara terpusat dan efisien.",
                href: "/dashboard/manajemen-karyawan-owner",
            },
        ],
    },
    {
        title: "Pengajuan Reimburse",
        items: [
            {
                icon: icons.manajemenKaryawanLogo,
                alt: "Pengajuan Reimburse",
                label: "Pengajuan Reimburse",
                description: "Kelola pengajuan reimburse karyawan dengan mudah dan efisien.",
                href: "/dashboard/pengajuan-reimburse",
            },
        ],
    },
    {
        title: "Laporan Perusahaan",
        items: [
            {
                icon: icons.rekapAbsensiKaryawanLogo,
                alt: "Rekap Absensi Karyawan",
                label: "Rekap Absensi Karyawan",
                description: "Tinjau laporan rekapitulasi absensi karyawan untuk analisis kehadiran bulanan atau tahunan.",
                href: "/dashboard/rekap-absensi-karyawan-owner",
            },
            {
                icon: icons.rekapCutiKaryawanLogo,
                alt: "Rekap Cuti Karyawan",
                label: "Rekap Cuti Karyawan",
                description: "Lihat rekap cuti karyawan berdasarkan jenis cuti, periode waktu, dan status pengajuan.",
                href: "/dashboard/rekap-cuti-karyawan-owner",
            },
            {
                icon: icons.rekapGajiKaryawanLogo,
                alt: "Rekap Gaji Karyawan",
                label: "Rekap Gaji Karyawan",
                description: "Tampilkan laporan penggajian untuk seluruh karyawan sebagai dasar evaluasi keuangan perusahaan.",
                href: "/dashboard/rekap-gaji-karyawan-owner",
            },
            {
                icon: icons.rekapKPIKaryawanLogo,
                alt: "Rekap Kinerja Karyawan",
                label: "Rekap Kinerja Karyawan",
                description: "Pantau performa keseluruhan karyawan berdasarkan hasil KPI dan evaluasi manajerial.",
                href: "/dashboard/rekap-kinerja-karyawan-owner",
            },
            {
                icon: icons.rekapReimbursePengeluaranLogo,
                alt: "Rekap Reimburse Pengeluaran",
                label: "Rekap Reimburse Pengeluaran",
                description: "Kelola laporan reimburse dan pengeluaran karyawan untuk transparansi serta kontrol anggaran.",
                href: "/dashboard/rekap-reimburse-pengeluaran-owner",
            },
        ],
    },
    {
        title: "Lain-lainnya",
        items: [
            {
                icon: icons.penilaianKPILogo,
                alt: "My Profile",
                label: "My Profile",
                description: "",
                href: "/dashboard/profile",
            },
        ],
    },
]
