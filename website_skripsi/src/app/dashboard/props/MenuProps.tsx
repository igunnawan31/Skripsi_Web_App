import { icons } from "@/app/lib/assets/assets"

export const MenuProps = [
    {
        title: "Dashboard",
        items: [
            {
                icon: icons.homeLogo,
                alt: "Dashboard",
                label: "Dashboard",
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
                href: "/dashboard/manajemen-indikator-kinerja-karyawan",
            },
            {
                icon: icons.penilaianKPILogo,
                alt: "Penilaian Kinerja Karyawan",
                label: "Penilaian Kinerja Karyawan",
                href: "/dashboard/penilaian-kinerja-karyawan",
            },
            {
                icon: icons.hasilKPILogo,
                alt: "Hasil Kinerja Karyawan",
                label: "Hasil Kinerja Karyawan",
                href: "/dashboard/hasil-kinerja-karyawan",
            },
        ],
    },
    {
        title: "Rekomendasi Freelance",
        items: [
            {
                icon: icons.rekomendasiFreelancerLogo,
                alt: "Rekomendasi Freelance",
                label: "Rekomendasi Freelance",
                href: "/dashboard/rekomendasi-freelance",
            }
        ]
    },
    {
        title: "Manejemen Karyawan",
        items: [
            {
                icon: icons.manajemenKaryawanLogo,
                alt: "Manejemen Karyawan",
                label: "Manejemen Karyawan",
                href: "/dashboard/manejemen-karyawan",
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
                href: "/dashboard/rekap-absensi-karyawan",
            },
            {
                icon: icons.rekapCutiKaryawanLogo,
                alt: "Rekap Cuti Karyawan",
                label: "Rekap Cuti Karyawan",
                href: "/dashboard/rekap-cuti-karyawan",
            },
            {
                icon: icons.rekapGajiKaryawanLogo,
                alt: "Rekap Gaji Karyawan",
                label: "Rekap Gaji Karyawan",
                href: "/dashboard/rekap-gaji-karyawan",
            },
            {
                icon: icons.rekapKPIKaryawanLogo,
                alt: "Rekap Kinerja Karyawan",
                label: "Rekap Kinerja Karyawan",
                href: "/dashboard/rekap-kinerja-karyawan",
            },
            {
                icon: icons.rekapReimbursePengeluaranLogo,
                alt: "Rekap Reimburse Pengeluaran",
                label: "Rekap Reimburse Pengeluaran",
                href: "/dashboard/rekap-reimburse-pengeluaran",
            },
        ],
    },
]