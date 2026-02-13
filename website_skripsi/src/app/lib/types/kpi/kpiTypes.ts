import { MajorRole, MinorRole } from "../enumTypes";
import { User } from "../types"

export enum StatusIndikatorKPI {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    ARCHIVED = "ARCHIVED",
}

export enum KategoriPertanyaanKPI {
    KINERJA = "KINERJA",
    SIFAT = "SIFAT",
}

export const SkalaNilai = [
    { nilai: 1, label: "Sangat Buruk" },
    { nilai: 2, label: "Buruk" },
    { nilai: 3, label: "Cukup" },
    { nilai: 4, label: "Baik" },
    { nilai: 5, label: "Sangat Baik" },
];

export type PertanyaanIndikatorResponse = {
    id: string,
    indikatorId: string,
    kategori: KategoriPertanyaanKPI,
    pertanyaan: string,
    bobot: number,
    aktif: boolean,
    urutanSoal: number,
    createdAt: string,
    updatedAt: string
}

export type JawabanIndikatorResponse = {
    id: string,
    indikatorId: string,
    pertanyaanId: string,
    nilai: number,
    notes: string,
    createdAt: string,
    updatedAt: string
}

export type RekapIndikatorResponse = {
    id: string,
    indikatorId: string,
    userId: string,
    totalNilai: number,
    rataRata: number,
    jumlahPenilai: number,
    keterangan: string | null,
    createdAt: string,
    updatedAt: string,
}

export type EvaluateIndikatorRespons = {
    indikatorId: string,
    evaluatorId: string,
    evaluatedId: string,
    createdAt: string,
}

export type IndikatorResponse = {
    id: string,
    name: string,
    description: string,
    startDate: string,
    endDate: string,
    statusPublic: boolean,
    status: StatusIndikatorKPI,
    createdById: string,
    createdAt: string,
    updatedAt: string,
    createdBy: User,
    evaluations: EvaluateIndikatorRespons[] | null,
    pertanyaan: PertanyaanIndikatorResponse[] | null,
    jawaban: JawabanIndikatorResponse[] | null, 
    rekap: RekapIndikatorResponse[] | null
}

export type EvalMapForm = {
    evaluatorId: string,
    evaluateeId: string[],
}

export type IndikatorCreateForm = {
    name: string,
    description: string,
    startDate: string,
    endDate: string,
    statusPublic: boolean | "",
    status: StatusIndikatorKPI | "",
    evalMap: EvalMapForm[],
}

export type EvalCreateForm = {
    evalMap: EvalMapForm[],
}

export type LayerPenilaian = {
    id: string;
    majorRolePenilai: MajorRole;       // Role yang memberi nilai
    minorRolePenilai?: MinorRole;
    menilaiRole: MinorRole[];     // Role yang bisa dinilai oleh rolePenilai
    hanyaDalamProject?: boolean;  // true = hanya berlaku untuk anggota project
};

export const layerPenilaian: LayerPenilaian[] = [
    {
        id: "L1",
        majorRolePenilai: MajorRole.OWNER,
        menilaiRole: [MinorRole.HR, MinorRole.PROJECT_MANAGER],
    },
    {
        id: "L2",
        majorRolePenilai: MajorRole.KARYAWAN,
        minorRolePenilai: MinorRole.HR,
        menilaiRole: [MinorRole.ADMIN],
    },
    {
        id: "L3",
        majorRolePenilai: MajorRole.KARYAWAN,
        minorRolePenilai: MinorRole.PROJECT_MANAGER,
        menilaiRole: [
            MinorRole.UI_UX,
            MinorRole.FRONTEND,
            MinorRole.BACKEND
        ],
        hanyaDalamProject: true,
    },
];

// <div className="mt-10 border-t border-gray-200 pt-6">
//                     <h2 className="text-md font-semibold mb-4">Daftar Pertanyaan KPI</h2>
//                     <div className="space-y-4">
//                         {formData.pertanyaan.map((p, i) => (
//                             <div
//                                 key={p.id}
//                                 className="relative border border-gray-200 bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition"
//                             >
//                                 <div className="mb-3">
//                                     <label className="text-sm font-medium text-gray-600">
//                                         Pertanyaan #{i + 1}
//                                     </label>
//                                     <input
//                                         type="text"
//                                         placeholder="Tulis pertanyaan..."
//                                         value={p.pertanyaan}
//                                         onChange={(e) =>
//                                             handleEditPertanyaan(p.id, "pertanyaan", e.target.value)
//                                         }
//                                         className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-yellow-500"
//                                     />
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4 mb-4">
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-600">
//                                             Bobot
//                                         </label>
//                                         <input
//                                             type="number"
//                                             min={1}
//                                             max={10}
//                                             value={p.bobot}
//                                             onChange={(e) =>
//                                                 handleEditPertanyaan(
//                                                     p.id,
//                                                     "bobot",
//                                                     parseFloat(e.target.value)
//                                                 )
//                                             }
//                                             className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-yellow-500"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="text-sm font-medium text-gray-600">
//                                             Kategori Pertanyaan
//                                         </label>
//                                         <select
//                                             value={p.kategoriPertanyaan}
//                                             onChange={(e) =>
//                                                 handleEditPertanyaan(
//                                                     p.id,
//                                                     "kategoriPertanyaan",
//                                                     e.target.value
//                                                 )
//                                             }
//                                             className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-yellow-500"
//                                         >
//                                             {Object.values(KategoriPertanyaanKPI).map((kategori) => (
//                                                 <option key={kategori} value={kategori}>
//                                                     {kategori}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 </div>
//                                 <div className="mt-4">
//                                     <label className="text-sm font-medium text-gray-600 mb-2 block">
//                                         Preview Skala Penilaian
//                                     </label>
//                                     <div className="flex flex-wrap gap-4">
//                                         {p.skalaNilai.map((skala) => (
//                                             <label
//                                                 key={skala.nilai}
//                                                 className="flex items-center gap-2"
//                                             >
//                                                 <input
//                                                     type="radio"
//                                                     name={`skala-${p.id}`}
//                                                     value={skala.nilai}
//                                                     disabled
//                                                     className="text-yellow-500 accent-yellow-500"
//                                                 />
//                                                 <span className="text-sm text-gray-700">
//                                                     {skala.nilai} - {skala.label}
//                                                 </span>
//                                             </label>
//                                         ))}
//                                     </div>
//                                 </div>
//                                 <div className="w-full flex justify-end items-end mt-5">
//                                     <button
//                                         type="button"
//                                         onClick={() => handleHapusPertanyaan(p.id)}
//                                         className="text-sm flex px-3 py-2 bg-(--color-primary) rounded-lg gap-2 cursor-pointer hover:bg-(--color-primary)/60"
//                                     >
//                                         <Image
//                                             src={icons.deleteLogo}
//                                             alt="Delete Logo"
//                                             width={16}
//                                             height={16}
//                                         />
//                                         <span className="text-white">
//                                             Hapus
//                                         </span>
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                         <div className="flex justify-center mt-6 w-full bg-(--color-tertiary)/30 rounded-lg p-20">
//                             <button
//                                 type="button"
//                                 onClick={handleTambahPertanyaan}
//                                 className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-medium cursor-pointer p-10 border-(--color-tertiary) border-2 rounded-lg bg-(--color-tertiary)/40"
//                             >
//                                 + Tambah Pertanyaan Baru
//                             </button>
//                         </div>
//                     </div>
//                 </div>