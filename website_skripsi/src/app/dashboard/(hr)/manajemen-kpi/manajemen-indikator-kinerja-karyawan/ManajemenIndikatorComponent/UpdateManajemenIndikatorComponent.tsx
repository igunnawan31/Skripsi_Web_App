"use client";

import { icons, logo } from "@/app/lib/assets/assets";
import { dummyUsers } from "@/app/lib/dummyData/dummyUsers";
import { KinerjaData } from "@/app/lib/dummyData/KinerjaData";
import { dummyProject } from "@/app/lib/dummyData/ProjectData";
import { useKpi } from "@/app/lib/hooks/kpi/useKpi";
import { useProject } from "@/app/lib/hooks/project/useProject";
import { useUser } from "@/app/lib/hooks/user/useUser";
import { EvalCreateForm, IndikatorCreateForm, layerPenilaian, StatusIndikatorKPI } from "@/app/lib/types/kpi/kpiTypes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import QuestionShow from "../QuestionIndikatorComponent/QuestionShow";
import QuestionUpdate from "../QuestionIndikatorComponent/QuestionUpdate";
import toast from "react-hot-toast";
import CustomToast from "@/app/rootComponents/CustomToast";
import { User } from "@/app/lib/types/types";
import { MajorRole, MinorRole } from "@/app/lib/types/enumTypes";
import CreateEvalModal from "./CreateEvalModal";
import ConfirmationPopUpModal from "@/app/dashboard/dashboardComponents/allComponents/ConfirmationPopUpModal";
import ManajemenIndikatorSkeletonDetail from "./ManajemenIndikatorSkeletonDetail";

export default function UpdateManajemenIndikatorComponent({id} : {id: string}) {
    const router = useRouter();

    const { data: fetchedData, isLoading, error, refetch } = useKpi().fetchIndicatorById(id);
    const { data: fetchedDataUser, isLoading: isLoadingUser, error: isErrorUser } = useUser().fetchAllUser();
    const { data: fetchedDataProject, isLoading: isLoadingProject, error: isErrorProject } = useProject().fetchAllProject();
    const { mutate, isPending } = useKpi().createEval();
    const { mutate: updateIndikator, isPending: isPendingUpdateIndikator} = useKpi().updateIndikator();

    const [selectedEvaluatorId, setSelectedEvaluatorId] = useState<string | null>(null);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);

    const [formData, setFormData] = useState<Partial<IndikatorCreateForm>>({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        statusPublic: false,
        status: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
    });

    const [formDataEval, setFormDataEval] = useState<EvalCreateForm>({ 
        evalMap: [],
    })

    const groupedEvaluations = useMemo(() => {
        if (!fetchedData || !fetchedDataUser?.data) return [];
        
        const map = fetchedData.evaluations.reduce((acc: any, curr: any) => {
            const evaluatorId = curr.evaluatorId;
            if (!acc[evaluatorId]) {
                acc[evaluatorId] = {
                    evaluatorId: evaluatorId,
                    evaluateeIds: []
                };
            }
            acc[evaluatorId].evaluateeIds.push(curr.evaluateeId);
            return acc;
        }, {});

        return Object.values(map);
    }, [fetchedData, fetchedDataUser]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            if (name === "statusPublic") {
                return {
                    ...prev,
                    statusPublic: value === "true"
                };
            }

            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const removeEvalMap = (evaluatorId: string) => {
        // remove by selectedEvaluatorId
    };

    const potentialEvaluators = useMemo(() => {
        if (!fetchedDataUser?.data) return [];
        return fetchedDataUser.data.filter((u: User) => 
            u.majorRole === MajorRole.OWNER || 
            u.minorRole === MinorRole.HR || 
            u.minorRole === MinorRole.PROJECT_MANAGER
        );
    }, [fetchedDataUser]);

    const getTargetEvaluatees = (penilai: User) => {
        if (!fetchedDataUser?.data) return [];

        const layer = layerPenilaian.find(l => 
            l.majorRolePenilai === penilai.majorRole && 
            (!l.minorRolePenilai || l.minorRolePenilai === penilai.minorRole)
        );

        if (!layer) return [];
        if (layer.hanyaDalamProject && penilai.minorRole === MinorRole.PROJECT_MANAGER) {
            if (!fetchedDataProject?.data) return [];

            // Ngeliat orang yang punya tim yang sama
            const projectsPMIsOn = fetchedDataProject.data.filter((proj: any) => 
                proj.projectTeams.some((team: any) => team.userId === penilai.id)
            );

            // Dapetin userId di tim yang sama
            const teammateIds = new Set(
                projectsPMIsOn.flatMap((proj: any) => proj.projectTeams.map((t: any) => t.userId))
            );

            return fetchedDataUser.data.filter((u: User) => 
                teammateIds.has(u.id) && 
                u.id !== penilai.id &&
                layer.menilaiRole.includes(u.minorRole as any)
            );
        }

        return fetchedDataUser.data.filter((u: User) => 
            u.id !== penilai.id && 
            layer.menilaiRole.includes(u.minorRole as any)
        );
    };

    const addEvalMapToModal = (userId: string) => {
        if (!userId) return;
        
        if (formDataEval.evalMap.some(e => e.evaluatorId === userId)) {
            toast.error("Penilai ini sudah masuk dalam daftar.");
            return;
        }

        const penilai = fetchedDataUser?.data.find((u: any) => u.id === userId);
        if (!penilai) return;

        const targets = getTargetEvaluatees(penilai);
        
        setFormDataEval(prev => ({
            evalMap: [
                ...prev.evalMap, 
                { evaluatorId: penilai.id, evaluateeId: targets.map((t: any) => t.id) }
            ]
        }));
    };

    const removeEvalFromModal = (evaluatorId: string) => {
        setFormDataEval(prev => ({
            evalMap: prev.evalMap.filter(item => item.evaluatorId !== evaluatorId)
        }));
    };

    const handleOpenCreateEval = () => {
        const existingEvals = groupedEvaluations.map((item: any) => ({
            evaluatorId: item.evaluatorId,
            evaluateeId: item.evaluateeIds
        }));

        setFormDataEval({ evalMap: existingEvals });
        setIsModalCreateOpen(true);
    };

    const handleCreateNewEval = () => {
        mutate({id, evalData: formDataEval}, {
            onSuccess: async () => {
                toast.custom(
                    <CustomToast 
                        type="success" 
                        message={"Eval berhasil diperbarui"} 
                    />
                );
                
                await refetch();
                setIsModalCreateOpen(false);
            },
            onError: (error) => {
                toast.custom(<CustomToast type="error" message={error.message || "Terjadi kesalahan"} />);
                setIsModalCreateOpen(false);
            },
        });
    }

    const handleOpenUpdateModal = () => {
        const newErrors = {
            name: "",
            description: "",
            startDate: "",
            endDate: "",
        };
        let isValid = true;

        if (!formData.name) {
            newErrors.name = "Nama indikator harus dipilih";
            isValid = false;
        }

        if (!formData.description) {
            newErrors.description = "Deskripsi indikator harus dipilih";
            isValid = false;
        }

        if (!formData.startDate) {
            newErrors.startDate = "Tanggal mulai harus diisi";
            isValid = false;
        }
        if (!formData.endDate) {
            newErrors.endDate = "Tanggal selesai harus diisi";
            isValid = false;
        } else if (formData.startDate && new Date(formData.startDate) > new Date(formData.endDate)) {
            newErrors.endDate = "Tanggal selesai tidak boleh sebelum tanggal mulai";
            isValid = false;
        }

        setErrors(newErrors as any);

        if (!isValid) {
            toast.custom(
                <CustomToast 
                    type="error" 
                    message="Mohon lengkapi semua field yang wajib diisi" 
                />
            );
            return;
        }

        setIsModalUpdateOpen(true);
    }

    const handleUpdateIndikator = () => {
        updateIndikator({id, indikatorData: formData}, {
            onSuccess: () => {
                toast.custom(
                    <CustomToast 
                        type="success" 
                        message={"Indikator berhasil diperbarui"} 
                    />
                );
                setIsModalUpdateOpen(false);
                setTimeout(() => {
                    router.push("/dashboard/manajemen-kpi/manajemen-indikator-kinerja-karyawan");
                }, 2000);
            },
            onError: (error) => {
                toast.custom(<CustomToast type="error" message={error.message || "Terjadi kesalahan"} />);
                setIsModalUpdateOpen(false);
            },
        });
    };

    useEffect(() => {
        if (fetchedData) {
            setFormData({
                name: fetchedData.name ?? "",
                description: fetchedData.description ?? "",
                startDate: fetchedData.startDate?.slice(0, 10) ?? "",
                endDate: fetchedData.endDate?.slice(0, 10) ?? "",
                statusPublic: fetchedData.statusPublic ?? "",
                status: fetchedData.status ?? StatusIndikatorKPI.ACTIVE,
            });
        }
    }, [fetchedData]);

    if (isLoading || isLoadingUser || isLoadingProject) {
        return <ManajemenIndikatorSkeletonDetail />
    }

    if (error && !fetchedData || isErrorUser || isErrorProject) {
        const noFetchedData = (
            <div className="flex flex-col gap-6 w-full pb-8">
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
                <div className="w-full bg-(--color-surface) rounded-2xl shadow-md px-6 py-12 border border-(--color-border) flex flex-col gap-6">
                    <div className="flex flex-col items-center justify-between gap-4">
                        <Image
                            src={logo.notFound}
                            width={240}
                            height={240}
                            alt="Not Found Data"
                        />
                        <div className="flex flex-col items-center">
                            <h1 className="text-2xl font-bold text-(--color-primary)">
                                Terdapat Kesalahan Dalam Memproses Data
                            </h1>
                            <span className="text-sm text-(--color-primary)">Mohon mengecek kembali detail kontrak kerja nanti</span>
                        </div>
                    </div>
                </div>
            </div>
        );

        return noFetchedData;
    }
    
    const renderHtml = (
        <div className="flex flex-col gap-6 w-full pb-8">
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
                        Update Indikator Kinerja Karyawan - {fetchedData.name}
                    </h1>
                </div>
                <span className="text-sm text-(--color-muted)">{fetchedData.id}</span>
            </div>
            <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                <form className="space-y-6">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            Nama Indikator <span className="text-(--color-primary)">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Masukkan nama Indikator"
                            className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                                errors.name ? "border-(--color-primary)" : "border-(--color-border)"
                            }`}
                            required
                        />
                        {errors.name && (
                            <p className="text-xs text-(--color-primary) mt-1 animate-in fade-in slide-in-from-top-1">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            Deskripsi Indikator <span className="text-(--color-primary)">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Tuliskan deskripsi singkat indikator..."
                            className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                                errors.description ? "border-(--color-primary)" : "border-(--color-border)"
                            }`}
                            required
                        />
                        {errors.description && (
                            <p className="text-xs text-(--color-primary) mt-1 animate-in fade-in slide-in-from-top-1">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">
                                Periode Mulai <span className="text-(--color-primary)">*</span>
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                                    errors.startDate ? "border-(--color-primary)" : "border-(--color-border)"
                                }`}
                                required
                            />
                        {errors.startDate && (
                            <p className="text-xs text-(--color-primary) mt-1 animate-in fade-in slide-in-from-top-1">
                                {errors.startDate}
                            </p>
                        )}
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">
                                Periode Selesai <span className="text-(--color-primary)">*</span>
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                                    errors.endDate ? "border-(--color-primary)" : "border-(--color-border)"
                                }`}
                                required
                            />
                            {errors.endDate && (
                                <p className="text-xs text-(--color-primary) mt-1 animate-in fade-in slide-in-from-top-1">
                                    {errors.endDate}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mt-10 border-t border-gray-200 pt-6">
                        <h2 className="text-md font-semibold mb-4">Pengaturan Tampilan</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-2">
                                    Status Publish
                                </label>
                                <input
                                    name="statusPublic"
                                    value={formData.statusPublic ? "True (Publik)" : "False (Private)"}
                                    onChange={handleChange}
                                    className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Tentukan apakah indikator ini dapat dilihat publik.
                                </p>
                                {formData.status === StatusIndikatorKPI.ACTIVE && (
                                    <div className="p-4 bg-(--color-primary)/10 border border-(--color-primary) rounded-lg mt-3">
                                        <p className="text-sm text-(--color-primary)">
                                            <strong>Info:</strong> Status Publish tidak bisa dirubah ketika Status Indikator : ACTIVE 
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-2">
                                    Status Indikator
                                </label>
                                <input
                                    type="text"
                                    name="status"
                                    value={formData.status ?? ""}
                                    onChange={handleChange}
                                    placeholder="Status Indikator"
                                    className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Pilih status saat ini dari indikator KPI ini.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={handleOpenUpdateModal}
                            disabled={isPendingUpdateIndikator}
                            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white transition cursor-pointer
                                ${isPendingUpdateIndikator
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-yellow-500 hover:bg-yellow-600 active:scale-[0.98]"
                                }`}
                        >
                            <Image src={icons.saveLogo} alt="Save Logo" width={18} height={18} />
                            {isPending ? "Menyimpan..." : "Simpan Perubahan Indikator Kinerja Karyawan"}
                        </button>
                    </div>
                </form>
            </div>
            <div className="mt-10 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-md font-semibold text-(--color-textPrimary)">
                        Pengaturan Penilai dan Target
                    </h2>
                    <button
                        type="button"
                        onClick={() => handleOpenCreateEval()}
                        className="w-fit flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 active:scale-[0.98] transition-all text-sm font-medium shadow-sm cursor-pointer"
                    >
                        <Image
                            src={icons.addLogo}
                            width={18}
                            height={18}
                            alt="Add Logo"
                            className="opacity-90"
                        />
                        Edit & Buat Penilai Baru
                    </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mt-2">
                    {groupedEvaluations.length > 0 ? (
                        groupedEvaluations.map((item: any, index: number) => {
                            const penilaiObj = fetchedDataUser?.data.find((u: any) => u.id === item.evaluatorId);
                            
                            return (
                                <div key={item.evaluatorId} className="flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                    <div className="px-4 py-3 bg-gray-50 flex justify-between items-center border-b border-gray-200">
                                        <span className="font-semibold text-sm text-(--color-textPrimary)">
                                            Kelompok Penilai #{index + 1}: {penilaiObj?.name}
                                        </span>
                                    </div>
                                    
                                    <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-xs text-(--color-muted) font-medium tracking-wider">
                                                Penilai (Orang yang Menilai)
                                            </p>
                                            <div className="text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-3 bg-white shadow-sm flex flex-col mt-3 border-l-4 border-l-yellow-500">
                                                <span className="font-semibold">{penilaiObj?.name || "User tidak ditemukan"}</span>
                                                <span className="text-xs text-gray-500">
                                                    {penilaiObj?.majorRole} — {penilaiObj?.minorRole}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-(--color-muted) font-medium tracking-wider">
                                                Target yang Dinilai ({item.evaluateeIds.length})
                                            </p>
                                            <div className="space-y-2 mt-3">
                                                {item.evaluateeIds.map((id: string) => {
                                                    const targetObj = fetchedDataUser?.data.find((u: any) => u.id === id);
                                                    return (
                                                        <div key={id} className="text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-3 bg-white shadow-sm flex flex-col border-l-4 border-l-blue-500">
                                                            <span className="font-semibold">{targetObj?.name || "User tidak ditemukan"}</span>
                                                            <span className="text-xs text-gray-500">
                                                                {targetObj?.majorRole} — {targetObj?.minorRole}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 italic text-sm">
                            Tidak ada data penilai dan target.
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-10 border-t border-gray-200 pt-6">
                <h2 className="text-md font-semibold mb-4">Daftar Pertanyaan KPI</h2>
                <QuestionUpdate fetchedData={fetchedData.id} />
            </div>
            <CreateEvalModal
                isOpen={isModalCreateOpen}
                onClose={() => setIsModalCreateOpen(false)}
                onSave={() => handleCreateNewEval()} 
                onEvaluatorChange={addEvalMapToModal}
                onRemoveItem={removeEvalFromModal}
                potentialEvaluators={potentialEvaluators}
                groupedEvaluations={groupedEvaluations}
                formDataEval={formDataEval}
                fetchedDataUser={fetchedDataUser}
                isPending={isPending}
            />
            <ConfirmationPopUpModal
                isOpen={isModalUpdateOpen}
                onAction={handleUpdateIndikator}
                onClose={() => setIsModalUpdateOpen(false)}
                type="success"
                title={"Konfirmasi Perubahan Indikator"}
                message={"Apakah Anda yakin sudah mengisi data dengan baik"}
                activeText={"Simpan"}
                passiveText="Batal"
            />
        </div>
    );

    return renderHtml;
}