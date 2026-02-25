"use client";

import ConfirmationPopUpModal from "@/app/dashboard/dashboardComponents/allComponents/ConfirmationPopUpModal";
import { icons, logo } from "@/app/lib/assets/assets";
import { dummyUsers } from "@/app/lib/dummyData/dummyUsers";
import { dummyProject } from "@/app/lib/dummyData/ProjectData";
import { useKpi } from "@/app/lib/hooks/kpi/useKpi";
import { useProject } from "@/app/lib/hooks/project/useProject";
import { useUser } from "@/app/lib/hooks/user/useUser";
import { MajorRole, MinorRole, StatusPublicKPI } from "@/app/lib/types/enumTypes";
import { IndikatorCreateForm, layerPenilaian, StatusIndikatorKPI } from "@/app/lib/types/kpi/kpiTypes";
import { User } from "@/app/lib/types/types";
import CustomToast from "@/app/rootComponents/CustomToast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import ManajemenIndikatorSkeletonDetail from "./ManajemenIndikatorSkeletonDetail";

const ManajemenIndikatorCreatePage = () => {
    const router = useRouter();
    const { data: fetchedDataUser, isLoading: isLoadingUser, error: isErrorUser } = useUser().fetchAllUser();
    const { data: fetchedDataProject, isLoading: isLoadingProject, error: isErrorProject } = useProject().fetchAllProject();
    const { mutate, isPending } = useKpi().createIndikator();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<IndikatorCreateForm>({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        statusPublic: false,
        status: "",
        evalMap: [],
    });
    const [errors, setErrors] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "",
    });

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

    const addEvalMap = (userId: string) => {
        const penilai = fetchedDataUser?.data.find((u: any) => u.id === userId);
        if (!penilai) return;

        if (formData.evalMap.some(item => item.evaluatorId === userId)) {
            toast.error("Penilai ini sudah ditambahkan");
            return;
        }

        const targets = getTargetEvaluatees(penilai);
        
        setFormData((prev) => ({
            ...prev,
            evalMap: [
                ...prev.evalMap,
                {
                    evaluatorId: penilai.id,
                    evaluateeId: targets.map((t: any) => t.id)
                }
            ]
        }));
    };

    const removeEvalMap = (evaluatorId: string) => {
        setFormData((prev) => ({
            ...prev,
            evalMap: prev.evalMap.filter(item => item.evaluatorId !== evaluatorId)
        }));
    };


    const handleOpenModal = () => {
        const newErrors = {
            name: "",
            description: "",
            startDate: "",
            endDate: "",
            statusPublic: "",
            status: "",
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
        } else if (new Date(formData.startDate) > new Date(formData.endDate)) {
            newErrors.endDate = "Tanggal selesai tidak boleh sebelum tanggal mulai";
            isValid = false;
        }
        if (!formData.status) {
            newErrors.status = "Status indikator harus dipilih";
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

        setIsModalOpen(true);
    }

    const handleSubmit = () => {
        mutate(formData, {
            onSuccess: () => {
                toast.custom(
                    <CustomToast 
                        type="success" 
                        message={"Indikator berhasil dibuat"} 
                    />
                );
                setIsModalOpen(false);
                setTimeout(() => {
                    router.push(`/dashboard/manajemen-kpi/manajemen-indikator-kinerja-karyawan/`);
                }, 2000);
            },
            onError: (error) => {
                toast.custom(<CustomToast type="error" message={error.message || "Terjadi kesalahan"} />);
                setIsModalOpen(false);
            },
        });
    };

    if (isLoadingProject || isLoadingUser) {
        return <ManajemenIndikatorSkeletonDetail />;
    }


    if (!fetchedDataProject || !fetchedDataUser) {
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
    };

    if (isErrorProject || isErrorUser) {
        const errorFetchedData = (
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
                            src={logo.error}
                            width={240}
                            height={240}
                            alt="Not Found Data"
                        />
                        <div className="flex flex-col items-center">
                            <h1 className="text-2xl font-bold text-(--color-primary)">
                                {isErrorProject?.message ? isErrorProject.message : "Terdapat kendala pada sistem"}
                                {isErrorUser?.message ? isErrorUser.message : "Terdapat kendala pada sistem"}
                            </h1>
                            <span className="text-sm text-(--color-primary)">Mohon untuk melakukan refresh atau kembali ketika sistem sudah selesai diperbaiki</span>
                        </div>
                    </div>
                </div>
            </div>
        );

        return errorFetchedData;
    };

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
                        Buat Indikator Kinerja Karyawan
                    </h1>
                </div>
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
                        <h2 className="text-md font-semibold mb-4">Pengaturan Penilai dan Target</h2>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                                <label className="text-sm font-medium text-gray-600 mb-2">
                                    Tambah Penilai Baru (opsional)
                                </label>
                                <select
                                    value=""
                                    onChange={(e) => addEvalMap(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-yellow-500"
                                >
                                    <option value="">-- Pilih Penilai untuk Ditambahkan --</option>
                                    {potentialEvaluators
                                        .filter((u : any) => !formData.evalMap.some(e => e.evaluatorId === u.id))
                                        .map((u: any) => (
                                            <option key={u.id} value={u.id}>
                                                {u.name} ({u.minorRole || u.majorRole})
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 gap-4 mt-2">
                                {formData.evalMap.length > 0 ? (
                                    formData.evalMap.map((item, index) => {
                                        const penilaiObj = fetchedDataUser?.data.find((u: any) => u.id === item.evaluatorId);
                                        
                                        return (
                                            <div key={item.evaluatorId} className="flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                                <div className="px-4 py-2 flex justify-between items-center border-b border-gray-200">
                                                    <span className="font-semibold text-sm text-(--color-textPrimary)">
                                                        Penilai #{index + 1}: {penilaiObj?.name}
                                                    </span>
                                                    <button 
                                                        type="button"
                                                        onClick={() => removeEvalMap(item.evaluatorId)}
                                                        className="text-sm flex px-3 py-2 bg-(--color-primary) rounded-lg gap-2 cursor-pointer hover:bg-(--color-primary)/60"
                                                    >
                                                        <Image
                                                            src={icons.deleteLogo}
                                                            alt="Delete Logo"
                                                            width={16}
                                                            height={16}
                                                        />
                                                        <span className="text-white">
                                                            Hapus
                                                        </span>
                                                    </button>
                                                </div>
                                                
                                                <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-xs text-(--color-muted) font-medium tracking-wider">
                                                            Penilai (Orang yang Menilai)
                                                        </p>
                                                        <div className="text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-3 bg-white shadow-sm flex flex-col mt-3 border-l-4 border-l-yellow-500">
                                                            <span className="font-semibold">{penilaiObj.name}</span>
                                                            <span className="text-xs">{penilaiObj.majorRole} — {penilaiObj.minorRole}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div>
                                                        <p className="text-xs text-(--color-muted) font-medium tracking-wider">
                                                            Target yang Dinilai ({item.evaluateeId.length})
                                                        </p>
                                                        <div className="space-y-2 mt-3">
                                                            {item.evaluateeId.map(id => {
                                                                const targetObj = fetchedDataUser?.data.find((u: any) => u.id === id);
                                                                return (
                                                                    <div key={id} className="text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-3 bg-white shadow-sm flex flex-col border-l-4 border-l-blue-500">
                                                                        <span className="font-semibold">{targetObj?.name}</span>
                                                                        <span className="text-xs">{targetObj?.majorRole} — {targetObj?.minorRole}</span>
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
                                        Belum ada penilai yang dipilih. Gunakan dropdown di atas untuk menambah penilai.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 border-t border-gray-200 pt-6">
                        <h2 className="text-md font-semibold mb-4">Pengaturan Tampilan</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-2">
                                    Status Publish <span className="text-(--color-primary)">*</span>
                                </label>
                                <select
                                    name="statusPublic"
                                    value={formData.statusPublic ? "true" : "false"}
                                    onChange={handleChange}
                                    className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors border-(--color-border)`}
                                    required
                                >
                                    <option value="true">True (Publik)</option>
                                    <option value="false">False (Privat)</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Tentukan apakah indikator ini dapat dilihat publik.
                                </p>
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mt-3">
                                    <p className="text-sm text-blue-800">
                                        <strong>Info:</strong> Status Publish tidak bisa dirubah ketika Status Indikator : ACTIVE 
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-2">
                                    Status Indikator <span className="text-(--color-primary)">*</span>
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                                        errors.status ? "border-(--color-primary)" : "border-(--color-border)"
                                    }`}
                                    required
                                >
                                    <option value="">-- Pilih Status --</option>
                                    {Object.values(StatusIndikatorKPI).map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                                {errors.status && (
                                    <p className="text-xs text-(--color-primary) mt-1 animate-in fade-in slide-in-from-top-1">
                                        {errors.status}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Pilih status saat ini dari indikator KPI ini.
                                </p>
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mt-3">
                                    <p className="text-sm text-blue-800">
                                        <strong>Info:</strong> Jika terdapat keraguan, anda dapat memilih Status Indikator : DRAFT 
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={handleOpenModal}
                            disabled={isPending}
                            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white transition cursor-pointer
                                ${isPending
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-yellow-500 hover:bg-yellow-600 active:scale-[0.98]"
                                }`}
                        >
                            <Image src={icons.saveLogo} alt="Save Logo" width={18} height={18} />
                            {isPending ? "Menyimpan..." : "Simpan Indikator Kinerja Karyawan"}
                        </button>
                    </div>
                </form>
            </div>
            <ConfirmationPopUpModal
                isOpen={isModalOpen}
                onAction={handleSubmit}
                onClose={() => setIsModalOpen(false)}
                type="success"
                title={"Konfirmasi Pembuatan Indikator"}
                message={"Apakah Anda yakin sudah mengisi data dengan baik"}
                activeText={"Simpan"}
                passiveText="Batal"
            />
        </div>
    );

    return renderHtml;
};

export default ManajemenIndikatorCreatePage;
