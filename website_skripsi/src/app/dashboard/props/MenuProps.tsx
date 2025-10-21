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
                href: "/dashboard/gaji-karyawan",
            },
        ],
    },
    {
        title: "Manajemen KPI",
        items: [
            {
                icon: icons.indikatorKPILogo,
                alt: "Manajemen Indikator KPI",
                label: "Manajemen Indikator KPI",
                href: "/dashboard/manajemen-indikator-kpi",
            },
            {
                icon: icons.penilaianKPILogo,
                alt: "Penilaian KPI",
                label: "Penilaian KPI",
                href: "/dashboard/penilaian-kpi",
            },
            {
                icon: icons.hasilKPILogo,
                alt: "Hasil KPI Karyawan",
                label: "Hasil KPI Karyawan",
                href: "/dashboard/hasil-kpi-karyawan",
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
    }
]