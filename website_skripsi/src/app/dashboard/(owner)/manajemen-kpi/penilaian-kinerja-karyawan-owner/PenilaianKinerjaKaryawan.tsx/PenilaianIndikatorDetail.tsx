'use client';

import { dummyUsers } from "@/app/lib/dummyData/dummyUsers";
import { KinerjaData } from "@/app/lib/dummyData/KinerjaData";
import { PenilaianKPIData } from "@/app/lib/dummyData/PenilaianKPIData";
import { dummySkalaNilai, PertanyaanKPIData } from "@/app/lib/dummyData/PertanyaanKPIData";
import { JawabanKPI } from "@/app/lib/types/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PenilaianIndikatorForm from "./PenilaianIndikatorForm";

export default function PenilaianIndikatorDetail({ id }: {id: string}) {
    const router = useRouter();
    const [data, setData] = useState<JawabanKPI | null>(null);
    const [formJawaban, setFormJawaban] = useState<{ 
        [key: string]: {nilai: number | null, notes: string} 
    }>({});
    const [loading, setLoading] = useState(true);
    const selectedUser = dummyUsers.find((item) => item.id === id);
    
    let indikatorIds = PenilaianKPIData
        .filter(k => k.dinilai.id === selectedUser?.id)
        .map(k => k.indikatorKPIId);

    if (indikatorIds.length === 0) {
        indikatorIds = KinerjaData
            .filter(k => k.pertanyaanUntuk.some(u => u.id === selectedUser?.id))
            .map(k => k.id);
    };
    indikatorIds = [...new Set(indikatorIds)];
    const jawabanUser = PenilaianKPIData.filter(
        (item) =>
            item.dinilai.id === selectedUser?.id &&
            indikatorIds.includes(item.indikatorKPIId)
    );

    const pertanyaanRelevan = PertanyaanKPIData.filter(
        p => indikatorIds.includes(p.IndikatorKPIId)
    );

    const convertNilai = jawabanUser.map(item => {
        const skala = dummySkalaNilai.find(skala => skala.nilai === item.nilai);

        return {
            ...item,
            label: skala ? skala.label : "Tidak Diketahui"
        };
    });
    
    const pertanyaanByCategory = PertanyaanKPIData
        .filter(item => indikatorIds.includes(item.IndikatorKPIId))
        .reduce((acc, p) => {
        const kategori = p.kategoriPertanyaan;
        if (!acc[kategori]) acc[kategori] = [];
        acc[kategori].push(p);
        return acc;
    }, {} as Record<string, typeof PertanyaanKPIData>);

    const categoriesQuestion = Object.entries(pertanyaanByCategory);
    const sudahDinilai = 
        jawabanUser.length > 0 &&
        pertanyaanRelevan.length > 0 &&
        pertanyaanRelevan.every((p) => {
            const jawab = jawabanUser.find(k => k.pertanyaanId === p.id)
            return jawab && jawab.nilai != null;
        });

    const allAnswered = categoriesQuestion.every(([_, list]) =>
        list.every((item) => {
            const ans = formJawaban?.[item.id];
            return ans && ans.nilai !== null;
        })
    );

    const nilaiAkhir = (() => {
        if (!sudahDinilai) return null;

        let total = 0;
        let totalBobot = 0;

        jawabanUser.forEach((jawab) => {
            const p = PertanyaanKPIData.find(q => q.id === jawab.pertanyaanId);
            if (p) {
                total += jawab.nilai * p.bobot;
                totalBobot += p.bobot;
            }
        });

        if (totalBobot === 0) return null;
        return (total / totalBobot).toFixed(2);
    })();
    
    const handleInputChange = (pertanyaanId: string, nilai: number) => {
        setFormJawaban((prev) => ({
            ...prev,
            [pertanyaanId]: {
                ...prev[pertanyaanId],
                nilai,
            },
        }));
    };
    const handleNotesChange = (pertanyaanId: string, notes: string) => {
        setFormJawaban((prev) => ({
            ...prev,
            [pertanyaanId]: {
                ...prev[pertanyaanId],
                notes
            },
        }));
    };

    useEffect(() => {
        setTimeout(() => {
            const jawabanPertama = PenilaianKPIData.find(
                (item) => item.dinilai.id === id
            );

            setData(jawabanPertama || ({ id } as JawabanKPI));
            setLoading(false);
        }, 200);
    }, [id]);


    if (loading) return <div className="text-center text-(--color-muted)">Memuat data...</div>;
    if (!data) return <div className="text-center text-red-500">Data tidak ditemukan.</div>;

    return (
        <div className="flex flex-col gap-6 w-full">
            {sudahDinilai ? (
                <>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-2xl font-bold text-(--color-text-primary)">Detail Penilaian Indikator Kinerja Karyawan</h1>
                        <span className="text-sm text-(--color-muted)">ID: {id}</span>
                    </div>
                    <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                        <div className="flex flex-col gap-2 p-4 bg-(--color-surface-variant) rounded-xl border border-(--color-border)">
                            <p className="text-lg font-semibold text-(--color-text-primary)">
                                Ringkasan Penilaian
                            </p>
                            <p className="text-sm text-(--color-text-secondary)">
                                Total Pertanyaan Dinilai: {jawabanUser.length}
                            </p>
                            <p className="text-sm text-(--color-text-secondary)">
                                Rata-rata Nilai: <span className="font-bold">{nilaiAkhir ?? "-"}</span>
                            </p>
                        </div>
                        <PenilaianIndikatorForm
                            categoriesQuestion={categoriesQuestion}
                            convertNilai={convertNilai}
                            judul={"Penilaian yang telah dilakukan"}
                            sudahDinilai={true}
                        />
                    </div>
                </>
            ) : (
                <>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-2xl font-bold text-(--color-text-primary)">Isi Penilaian Indikator Kinerja Karyawan</h1>
                        <span className="text-sm text-(--color-muted)">ID: {id}</span>
                    </div>
                    <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                        <PenilaianIndikatorForm
                            categoriesQuestion={categoriesQuestion}
                            convertNilai={convertNilai}
                            judul={`Form Penilaian ${selectedUser?.nama}`}
                            sudahDinilai={false}
                            formJawaban={formJawaban}
                            handleInputChange={handleInputChange}
                            handleNotesChange={handleNotesChange}
                            allAnswered={allAnswered}
                        />
                    </div>
                </>
            )}
        </div>   
    )
}