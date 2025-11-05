import { Project } from "../types/types";
import { dummyUsers } from "./dummyUsers";

export const dummyProject: Project[] = [
  {
    projectId: "PRJ001",
    projectName: "Sistem Manajemen Karyawan",
    ketuaProject: dummyUsers.find((u) => u.nama === "Rafi Ramadhan"),
    anggotaProject: dummyUsers.filter((u) =>
        ["Citra Lestari", "Budi Santoso", "Fauzan Pratama"].includes(u.nama)
    ),
  },
  {
    projectId: "PRJ002",
    projectName: "Aplikasi Penilaian Kinerja",
    ketuaProject: dummyUsers.find((u) => u.nama === "Intan Wulandari"),
    anggotaProject: dummyUsers.filter((u) =>
        ["Rafi Ramadhan", "Siti Nurhaliza", "Teguh Mahendra"].includes(u.nama)
    ),
  },
  {
    projectId: "PRJ003",
    projectName: "Dashboard Keuangan Internal",
    ketuaProject: dummyUsers.find((u) => u.nama === "Fauzan Pratama"),
    anggotaProject: dummyUsers.filter((u) =>
      ["Citra Lestari", "Siti Nurhaliza"].includes(u.nama)
    ),
  },
];