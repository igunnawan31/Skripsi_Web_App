'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PenilaianIndikatorForm from "./PenilaianIndikatorForm";
import { useKpi } from "@/app/lib/hooks/kpi/useKpi";
import { AnswerCreateForm, KategoriPertanyaanKPI, PertanyaanIndikatorResponse, SkalaNilai } from "@/app/lib/types/kpi/kpiTypes";
import { useJawaban } from "@/app/lib/hooks/kpi/useJawaban";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import ConfirmationPopUpModal from "@/app/dashboard/dashboardComponents/allComponents/ConfirmationPopUpModal";
import toast from "react-hot-toast";
import CustomToast from "@/app/rootComponents/CustomToast";

export default function PenilaianIndikatorDetail({ id }: {id: string}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const evaluatee = searchParams.get("evaluatee") || "";
    
    const { data: detailDataPertanyaan, isLoading: isDetailPertanyaanLoading, error: detailPertanyaanError } = useKpi().fetchAllQuestionByIdIndikator({id: id});
    const { data: detailDataJawaban, isLoading: isDetailJawabanLoading, error: detailJawabanError } = useJawaban().fetchAllJawaban();
    const { mutate: createAnswer, isPending } = useJawaban().createAnswer();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formJawaban, setFormJawaban] = useState<{ [key: string]: { nilai: number | null, notes: string } }>({});

    const jawabanMilikTarget = detailDataJawaban?.data?.filter(
        (j: any) => j.evaluatee?.id === evaluatee && j.indikatorId === id
    ) || [];
    const sudahDinilai = jawabanMilikTarget.length > 0;

    const pertanyaanByCategory = (detailDataPertanyaan?.data || []).reduce((acc: any, p: any) => {
        const kategori = p.kategori || KategoriPertanyaanKPI.KINERJA; 
        if (!acc[kategori]) acc[kategori] = [];
        acc[kategori].push(p);
        return acc;
    }, {});

    const categoriesQuestion = Object.entries(pertanyaanByCategory) as [string, any[]][];

    const allAnswered = (detailDataPertanyaan?.data || []).every((p: any) => 
        formJawaban[p.id]?.nilai !== null && formJawaban[p.id]?.nilai !== undefined
    );

    const hitungNilaiAkhir = () => {
        if (sudahDinilai) {
            // 1. Hitung dari data database (jawabanMilikTarget)
            // Kita perlu mencocokkan bobot dari detailDataPertanyaan
            let totalWeightedScore = 0;
            let totalBobot = 0;

            jawabanMilikTarget.forEach((j: any) => {
                const pertanyaan = detailDataPertanyaan?.data?.find((p: any) => p.id === j.pertanyaanId);
                const bobot = pertanyaan?.bobot || 1;
                totalWeightedScore += (j.nilai * bobot);
                totalBobot += bobot;
            });

            return totalBobot > 0 ? (totalWeightedScore / totalBobot).toFixed(2) : "0";
        } else {
            // 2. Hitung real-time dari state formJawaban
            let totalWeightedScore = 0;
            let totalBobot = 0;

            Object.entries(formJawaban).forEach(([pertanyaanId, data]) => {
                if (data.nilai !== null) {
                    const pertanyaan = detailDataPertanyaan?.data?.find((p: any) => p.id === pertanyaanId);
                    const bobot = pertanyaan?.bobot || 1;
                    totalWeightedScore += (data.nilai * bobot);
                    totalBobot += bobot;
                }
            });

            return totalBobot > 0 ? (totalWeightedScore / totalBobot).toFixed(2) : "0";
        }
    };

    const nilaiAkhir = hitungNilaiAkhir();

    useEffect(() => {
        if (detailDataPertanyaan?.data && Object.keys(formJawaban).length === 0 && !sudahDinilai) {
            const initialForm: { [key: string]: { nilai: number | null, notes: string } } = {};
            detailDataPertanyaan.data.forEach((p: any) => {
                initialForm[p.id] = { nilai: null, notes: "" };
            });
            setFormJawaban(initialForm);
        }
    }, [detailDataPertanyaan]);

    useEffect(() => {
        if (sudahDinilai && jawabanMilikTarget.length > 0) {
            const existingAnswers: { [key: string]: { nilai: number | null, notes: string } } = {};
            jawabanMilikTarget.forEach((j: any) => {
                existingAnswers[j.pertanyaanId] = {
                    nilai: j.nilai,
                    notes: j.notes || ""
                };
            });
            setFormJawaban(existingAnswers);
        }
    }, [detailDataJawaban]);

    const handleOpenModal = () => {
        if (!allAnswered) {
            toast.custom(<CustomToast type="error" message="Mohon lengkapi semua penilaian" />);
            return;
        }
        setIsModalOpen(true);
    };

    const handleSubmit = () => {
        const payload: AnswerCreateForm[] = Object.entries(formJawaban).map(([pertanyaanId, data]) => ({
            indikatorId: id,            
            pertanyaanId: pertanyaanId, 
            evaluateeId: evaluatee,     
            notes: data.notes || "",
            nilai: data.nilai as number
        }));

        createAnswer(payload, {
            onSuccess: async () => {
                toast.custom(
                    <CustomToast 
                        type="success" 
                        message="Pertanyaan berhasil dibuat" 
                    />
                );

                setIsModalOpen(false);
                setTimeout(() => {
                    router.push(`/dashboard/manajemen-kpi/penilaian-kinerja-karyawan/`);
                }, 2000);
            },
            onError: (err) => {
                toast.custom(
                    <CustomToast 
                        type="error"
                        message={err.message} 
                    />
                );
                setIsModalOpen(false);
            }
        });
    }
    
    if (isDetailJawabanLoading || isDetailPertanyaanLoading) {
        return <div className="text-center text-(--color-muted)">Memuat data...</div>;
    }

    if (detailJawabanError || detailPertanyaanError) {
        return <div className="text-center text-red-500">Terjadi kesalahan.</div>;
    }

    if (!detailDataJawaban || !detailDataPertanyaan) {
        return <div className="text-center text-red-500">Data tidak ditemukan.</div>;
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            {sudahDinilai ? (
                <>
                    <div className="flex flex-col gap-6 w-full">
                        <button
                            onClick={() => router.back()}
                            className="w-fit px-3 py-2 bg-(--color-primary) hover:bg-red-800 flex flex-row gap-3 rounded-lg cursor-pointer transition"
                        >
                            <Image
                                src={icons.arrowLeftActive}
                                alt="Back Arrow"
                                width={20}
                                height={20}
                            />
                            <p className="text-(--color-surface)">
                                Kembali ke halaman sebelumnya
                            </p>
                        </button>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-row gap-4 items-center">
                                <h1 className="text-2xl font-bold text-(--color-text-primary)">
                                    Detail Penilaian Indikator Kinerja Karyawan
                                </h1>
                            </div>
                            <span className="text-sm text-(--color-muted)">ID: {evaluatee}</span>
                        </div>
                    </div>
                    <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                        <div className="flex flex-col gap-2 p-4 bg-(--color-surface-variant) rounded-xl border border-(--color-border)">
                            <p className="text-lg font-semibold text-(--color-text-primary)">
                                Ringkasan Penilaian
                            </p>
                            <p className="text-sm text-(--color-text-secondary)">
                                Total Pertanyaan Dinilai: {sudahDinilai ? jawabanMilikTarget.length : Object.values(formJawaban).filter(v => v.nilai !== null).length}
                            </p>
                            <p className="text-sm text-(--color-text-secondary)">
                                Rata-rata Nilai (Tertimbang): <span className="font-bold text-(--color-primary)">{nilaiAkhir}</span>
                            </p>
                        </div>
                        <PenilaianIndikatorForm
                            categoriesQuestion={categoriesQuestion}
                            convertNilai={jawabanMilikTarget}
                            judul={"Penilaian yang telah dilakukan"}
                            sudahDinilai={true}
                        />
                    </div>
                </>
            ) : (
                <>
                    <div className="flex flex-col gap-6 w-full">
                        <button
                            onClick={() => router.back()}
                            className="w-fit px-3 py-2 bg-(--color-primary) hover:bg-red-800 flex flex-row gap-3 rounded-lg cursor-pointer transition"
                        >
                            <Image
                                src={icons.arrowLeftActive}
                                alt="Back Arrow"
                                width={20}
                                height={20}
                            />
                            <p className="text-(--color-surface)">
                                Kembali ke halaman sebelumnya
                            </p>
                        </button>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-row gap-4 items-center">
                                <h1 className="text-2xl font-bold text-(--color-text-primary)">
                                    Isi Penilaian Indikator Kinerja Karyawan
                                </h1>
                            </div>
                            <span className="text-sm text-(--color-muted)">ID: {evaluatee}</span>
                        </div>
                    </div>
                    <PenilaianIndikatorForm
                        categoriesQuestion={categoriesQuestion}
                        convertNilai={jawabanMilikTarget}
                        judul={sudahDinilai ? "Hasil Penilaian" : "Form Penilaian"}
                        sudahDinilai={sudahDinilai}
                        formJawaban={formJawaban}
                        handleInputChange={(id, nilai) => setFormJawaban(prev => ({...prev, [id]: {...prev[id], nilai}}))}
                        handleNotesChange={(id, notes) => setFormJawaban(prev => ({...prev, [id]: {...prev[id], notes}}))}
                        allAnswered={allAnswered}
                        onSubmit={handleOpenModal}
                    />
                </>
            )}
            <ConfirmationPopUpModal
                isOpen={isModalOpen}
                onAction={handleSubmit}
                onClose={() => setIsModalOpen(false)}
                type="info"
                title={"Konfirmasi Simpan Penilaian"}
                message={"Apakah Anda yakin ingin menghapus data pertanyaan ini"}
                activeText="Ya"
                passiveText="Batal"
            />
        </div>   
    )
}