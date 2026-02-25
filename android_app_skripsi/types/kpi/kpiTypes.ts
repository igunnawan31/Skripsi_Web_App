import { MajorRole, MinorRole } from "../enumTypes";
import { User } from "../user/userTypes";

export enum StatusIndikatorKPI {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    ARCHIVED = "ARCHIVED",
}

export enum booleanStatus {
    true = "true",
    false = "false",
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

export type EvalCreateForm = {
    evalMap: EvalMapForm[],
}

export type EvalResponse = {
    indikatorId: string,
    evaluatorId: string,
    evaluateeId: string,
    createdAt : string,
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

export type QuestionCreateForm = {
    kategori: KategoriPertanyaanKPI,
    pertanyaan: string,
    bobot: number,
    aktif: boolean,
    urutanSoal: number,
    indikatorId: string,
}

export type AnswerCreateForm = {
    indikatorId: string,
    pertanyaanId: string,
    evaluateeId: string,
    notes: string,
    nilai: number,
}
