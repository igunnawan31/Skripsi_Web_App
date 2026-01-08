"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { KontrakKerjaStatus } from "@/app/lib/types/types";
import { useKontrak } from "@/app/lib/hooks/kontrak/useKontrak";
import { CreateKontrakKerja, UpdateKontrakKerja } from "@/app/lib/types/kontrak/kontrakTypes";
import { MajorRole, MetodePembayaran, MinorRole } from "@/app/lib/types/enumTypes";
import toast from "react-hot-toast";
import CustomToast from "@/app/rootComponents/CustomToast";
import { useProject } from "@/app/lib/hooks/project/useProject";
import ConfirmationPopUpModal from "@/app/dashboard/dashboardComponents/allComponents/ConfirmationPopUpModal";
import { fetchFileBlob } from "@/app/lib/path";

export default function UpdateKontrakKerjaPage({ id }: { id: string }) {
    const router = useRouter();
    const [openUserData, setOpenUserData] = useState(true);
    const [openProject, setOpenProject] = useState(true);
    const [openAbsensi, setOpenAbsensi] = useState(true);
    const [openPembayaran, setOpenPembayaran] = useState(true);
    const { data: fetchedData, isLoading, error} = useKontrak().fetchKontrakById(id);
    const updateKontrak = useKontrak().updateKontrak();
    const { mutate, isPending } = updateKontrak;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<UpdateKontrakKerja>>({
        userData: {
            email: "",
            name: "",
            password: "Rahasia123",
            majorRole: "",
            minorRole: "",
        },
        projectData: {
            id: "",
        },

        jenis: "",
        metodePembayaran: "",
        dpPercentage: 0,
        finalPercentage: 0,
        totalBayaran: 0,

        absensiBulanan: 0,
        cutiBulanan: 0,
        status: KontrakKerjaStatus.ACTIVE,
        catatan: "",
        contractDocuments: null,
        userPhoto: null,

        startDate: "",
        endDate: "",

        removeDocuments: []
    });
    const data = fetchedData;
    const [projectStartDate, setProjectStartDate] = useState("");
    const [projectEndDate, setProjectEndDate] = useState("");
    const [monthlyPercentages, setMonthlyPercentages] = useState<number[]>([]);
    const [monthlyPresence, setMonthlyPresence] = useState<{ bulan: string; absensi: number; cuti: number }[]>([]);
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [documentFiles, setDocumentFiles] = useState<File[]>([]);
    const [previewDocumentUrl, setPreviewDocumentUrl] = useState<string | null>(null);
    const [activePreviewIndex, setActivePreviewIndex] = useState<number | null>(null);
    const [lockDate, setLockDate] = useState(false);
    
    useEffect(() => {
        if (formData?.metodePembayaran === MetodePembayaran.MONTHLY && formData.startDate && formData.endDate) {
            const totalMonths = getMonthDifference(formData.startDate, formData.endDate);
            if (totalMonths > 0) {
                const equalPercent = 100 / totalMonths
                setMonthlyPercentages(new Array(totalMonths).fill(equalPercent));
            }
        }
    }, [formData?.startDate, formData?.endDate, formData?.metodePembayaran]);

    useEffect(() => {
        if (!formData?.startDate || !formData.endDate) return;

        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const cutiBulanan = Number(formData.cutiBulanan ?? 0);

        const months: { bulan: string; absensi: number; cuti: number }[] = [];

        let current = new Date(start);

        while (current <= end) {
            const year = current.getFullYear();
            const month = current.getMonth();

            const firstOfMonth = new Date(year, month, 1);
            const lastOfMonth = new Date(year, month + 1, 0);

            const rangeStart = (year === start.getFullYear() && month === start.getMonth()) ? start : firstOfMonth;
            const rangeEnd = (year === end.getFullYear() && month === end.getMonth()) ? end : lastOfMonth;

            const totalWorkDays = countWorkDaysInRange(rangeStart, rangeEnd);
            const cuti = Math.min(cutiBulanan, totalWorkDays);
            const absensi = Math.max(totalWorkDays - cuti, 0);

            const bulanNama = current.toLocaleString("id-ID", { month: "long", year: "numeric" });

            months.push({
                bulan: bulanNama,
                absensi,
                cuti
            });

            current = new Date(year, month + 1, 1);
        }

        setMonthlyPresence(months);
    }, [formData.startDate, formData.endDate, formData.cutiBulanan]);
        
    useEffect(() => {
        return () => {
            if (previewPhoto) URL.revokeObjectURL(previewPhoto);
        };
    }, [previewPhoto]);

    const countWorkDaysInRange = (start: Date, end: Date): number => {
        let count = 0;
        let current = new Date(start);
        while (current <= end) {
            const day = current.getDay();
            if (day !== 0 && day !== 6) {
                count++;
            }
            current.setDate(current.getDate() + 1);
        }

        return count;
    }

    const getMonthDifference = (startDate: string, endDate: string): number => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const years = end.getFullYear() - start.getFullYear();
        const months = end.getMonth() - start.getMonth();
        return years * 12 + months + 1;
    };
    
    
    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev): Partial<CreateKontrakKerja> => ({
            ...prev,
            userData: {
                email: prev.userData?.email ?? "",      
                name: prev.userData?.name ?? "",        
                password: prev.userData?.password ?? "",
                majorRole: prev.userData?.majorRole ?? "",
                minorRole: prev.userData?.minorRole ?? "",
                [name]: value,
            },
        }));
    };

    const handleDPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Math.max(Number(e.target.value), 0), 100);
        setFormData(prev => ({
            ...prev,
            dpPercentage: value,
            finalPercentage: 100 - value,
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (lockDate && (name === "startDate" || name === "endDate")) return;

        setFormData(prev => ({
            ...prev,
            [name]: name === "metodePembayaran" ? (value as MetodePembayaran) : 
                    name === "totalBayaran" ? Number(value) : value
        }));
    };

    
    const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^\d]/g, "");
        setFormData({ ...formData, totalBayaran: Number(rawValue) });
    };

    const loadPhoto = async (photoPath: string) => {
        try {
            const blob = await fetchFileBlob(photoPath);
            const reader = new FileReader();
            reader.onload = () => setPreviewPhoto(reader.result as string);
            reader.readAsDataURL(blob);
        } catch (err) {
            console.error("Load photo error:", err);
            setPreviewPhoto(null);
        }
    };

    useEffect(() => {
        if (data?.user?.photo?.path) {
            loadPhoto(data.user.photo.path);
        }
    }, [data?.user?.photo?.path]);

    const handleAddDocuments = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        if (files.some(file => file.type !== "application/pdf")) {
            toast.custom(<CustomToast type="error" message="Hanya file PDF yang diperbolehkan" />);
            return;
        }
        if (files.some(file => file.size > 10 * 1024 * 1024)) {
            toast.custom(<CustomToast type="error" message="Ukuran file maksimal 10MB" />);
            return;
        }

        setDocumentFiles(prev => [...prev, ...files]);

        setFormData(prev => ({
            ...prev,
            contractDocuments: [...(prev.contractDocuments || []), ...files]
        }));
    };

    const handleChangeDocument = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;


        if (file.type !== "application/pdf") {
            toast.custom(<CustomToast type="error" message="Hanya file PDF yang diperbolehkan" />);
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.custom(<CustomToast type="error" message="Ukuran file maksimal 10MB" />);
            return;
        }

        setDocumentFiles(prev => {
            const copy = [...prev];
            copy[index] = file;
            return copy;
        });

        setFormData(prev => {
            const copy = [...(prev.contractDocuments || [])];
            copy[index] = file;
            return { ...prev, contractDocuments: copy };
        });

        toast.custom(<CustomToast type="success" message="Dokumen berhasil diganti" />);
    };

    const handleDeleteDocument = (index: number) => {
        setDocumentFiles(prev => {
            const copy = [...prev];
            copy.splice(index, 1);
            return copy;
        });

        setFormData(prev => {
            const copy = [...(prev.contractDocuments || [])];
            copy.splice(index, 1);
            return { ...prev, contractDocuments: copy };
        });

        toast.custom(<CustomToast type="success" message="Dokumen berhasil dihapus" />);
    };

    const handlePreviewFile = (index: number) => {
        const file = documentFiles[index];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setPreviewDocumentUrl(url);
        setActivePreviewIndex(index);
    };

    const handlePreviewPhoto = () => {
        if (!previewPhoto) return;
        setIsPhotoModalOpen(true);
    };

    const handleClosePhotoPreview = () => {
        setIsPhotoModalOpen(false);
    };

    const handleDownloadPhoto = () => {
        if (!previewPhoto) return;
        const a = document.createElement("a");
        a.href = previewPhoto;
        a.download = data.user?.photo?.name;
        a.click();
    }

    const handleDownloadFile = (index: number) => {
        const file = documentFiles[index];
        if (!file) return;

        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();

        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        return () => {
            documentFiles.forEach(file => URL.revokeObjectURL(file as any));
            if (previewDocumentUrl) URL.revokeObjectURL(previewDocumentUrl);
        };
    }, [documentFiles, previewDocumentUrl]);
    
    const getFileIcon = (type: any) => {
        if (!type) return icons.pdfFormat;
        if (type === "application/pdf") return icons.pdfFormat;
        if (type.startsWith("image/")) return icons.imageFormat;

        return icons.pdfFormat;
    };

    const handleOpenModal = () => {
        // if (!formData..trim()) {
        //     toast.custom(<CustomToast type="error" message="Nama project harus diisi" />)
        //     return;
        // }

        // if (!formData.description.trim()) {
        //     toast.custom(<CustomToast type="error" message="Deskripsi project harus diisi" />)
        //     return;
        // }        

        // if (!formData.startDate || !formData.endDate) {
        //     toast.custom(<CustomToast type="error" message="Tanggal mulai dan Tanggal selesai harus diisi" />)
        //     return;
        // }

        // if (new Date(formData.startDate) > new Date(formData.endDate)) {
        //     toast.custom(<CustomToast type="error" message="Tanggal selesai tidak boleh lebih dari tanggal mulai" />)
        //     return;
        // }

        setIsModalOpen(true);
    }

    const handleSubmit = () => {
        console.log(formData);
        mutate({id, kontrakData: formData}, {
            onSuccess: () => {
                toast.custom(
                    <CustomToast 
                        type="success" 
                        message={"Kontrak kerja berhasil dibuat"} 
                    />
                );
                setIsModalOpen(false);
                setTimeout(() => {
                    router.push("/dashboard/kontrak-kerja-karyawan");
                }, 2000);
            },
            onError: (error) => {
                toast.custom(<CustomToast type="error" message={error.message || "Terjadi kesalahan"} />);
                setIsModalOpen(false);
            },
        });
    };

    useEffect(() => {
        const loadData = async () => {
            if (!data) return;
            setFormData({
                userData: {
                    name: data.user?.name ?? "",
                    email: data.user?.email ?? "",
                    password: data.user?.password ?? "Rahasia123",
                    majorRole: data.user?.majorRole ?? "",
                    minorRole: data.user?.minorRole ?? "",
                },
                projectData: {
                    id: data.projectId ?? "",
                },
                jenis: data.jenis ?? "",
                metodePembayaran: data.metodePembayaran ?? "",
                dpPercentage: data.dpPercentage ?? 0,
                finalPercentage: data.finalPercentage ?? 0,
                totalBayaran: data.totalBayaran ?? 0,
                absensiBulanan: data.absensiBulanan ?? 0,
                cutiBulanan: data.cutiBulanan ?? 0,
                status: data.status ?? KontrakKerjaStatus.ACTIVE,
                catatan: data.catatan ?? "",
                contractDocuments: null,
                userPhoto: null,
                startDate: data.startDate ? new Date(data.startDate).toISOString().split("T")[0] : "",
                endDate: data.endDate ? new Date(data.endDate).toISOString().split("T")[0] : "",
            });

            const projectS = data.startDate ? new Date(data.startDate).toISOString().split("T")[0] : "";
            const projectE = data.endDate ? new Date(data.endDate).toISOString().split("T")[0] : "";

            setProjectStartDate(projectS);
            setProjectEndDate(projectE);

            if (projectS === projectE && projectS === projectE) {
                setLockDate(true);
                setFormData(prev => ({
                    ...prev,
                    startDate: projectS,
                    endDate: projectE
                }));
            }
            if (data.user?.photo?.path) {
                try {
                    const blob = await fetchFileBlob(data.user.photo.path);
                    const reader = new FileReader();
                    reader.onload = () => setPreviewPhoto(reader.result as string);
                    reader.readAsDataURL(blob);
                } catch (err) {
                    console.error("Load photo error:", err);
                    setPreviewPhoto(null);
                }
            }

            if (Array.isArray(data.documents) && data.documents.length > 0) {
                const pdfFiles: File[] = [];

                for (const doc of data.documents) {
                    if (!doc.path) continue;
                    try {
                        const blob = await fetchFileBlob(doc.path);
                        const file = new File([blob], doc.originalname ?? "Unknown Document", {
                            type: doc.mimetype ?? "application/pdf",
                        });
                        pdfFiles.push(file);
                    } catch (err) {
                        console.error("Load document error:", err);
                    }
                }

                setDocumentFiles(pdfFiles);
            }
        };

        loadData();
    }, [data]);

    const dpPercent = formData.dpPercentage ?? 0;
    const finalPercent = 100 - dpPercent;
    const dpNominal = formData.totalBayaran ? (formData.totalBayaran * dpPercent) / 100 : 0;
    const finalNominal = formData.totalBayaran ? (formData.totalBayaran * finalPercent) / 100 : 0;

    if (isLoading) {
        return <div className="text-center text-(--color-muted)">Memuat data...</div>;
    };

    if (!fetchedData) {
        return <div className="text-center text-red-500">Data tidak ditemukan.</div>;
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
                        Update Kontrak Kerja
                    </h1>
                </div>
                <span className="text-sm text-(--color-muted)">{data.id}</span>
            </div>

            <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                <form className="space-y-6">
                    <div className="flex flex-col gap-6">
                        <button
                            type="button"
                            onClick={() => setOpenUserData((prev) => !prev)}
                            className="flex justify-between items-center w-full cursor-pointer"
                        >
                            <h2 className="text-lg font-semibold text-(--color-text-primary)">
                                User Data Section
                            </h2>
                            <Image
                                src={icons.arrowData}
                                width={20}
                                height={20}
                                alt="Arrow Data"
                                className={`transition-transform duration-300 ${
                                    openUserData ? "-rotate-90" : "rotate-0"
                                }`}
                            />
                        </button>
                        {openUserData && (
                            <>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Nama Karyawan</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.userData?.name}
                                        onChange={handleUserChange}
                                        placeholder="Masukkan nama karyawan"
                                        className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Email Karyawan</label>
                                    <input
                                        type="text"
                                        name="email"
                                        value={formData.userData?.email}
                                        onChange={handleUserChange}
                                        placeholder="Masukkan email karyawan"
                                        className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Major Role</label>
                                    <select
                                        name="majorRole"
                                        value={formData.userData?.majorRole}
                                        onChange={handleUserChange}
                                        className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        required
                                    >
                                        <option value="">-- Major Role --</option>
                                        {Object.values(MajorRole).map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Minor Role</label>
                                    <select
                                        name="minorRole"
                                        value={formData.userData?.minorRole}
                                        onChange={handleUserChange}
                                        className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        required
                                    >
                                        <option value="">-- Minor Role --</option>
                                        {Object.values(MinorRole).map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Upload Foto Karyawan (png, jpeg, jpg)</label>

                                    {previewPhoto && (
                                        <div className="flex justify-between items-center rounded-lg p-4 border border-(--color-border) shadow-sm hover:shadow-md transition-shadow bg-white">
                                            <div className="flex flex-row gap-4">
                                                <div className="w-20 h-20 bg-(--color-secondary) rounded-lg items-center justify-center relative">
                                                    <Image
                                                        src={getFileIcon(data.user?.photo?.mimetype)}
                                                        fill
                                                        alt="Photo Format"
                                                        className="object-cover p-1 rounded-lg"
                                                    />
                                                </div>

                                                <div className="flex flex-col justify-center gap-1">
                                                    <p className="text-md font-bold">{data.user?.photo?.originalname}</p>
                                                    <p className="text-sm font-medium text-(--color-text-secondary)">{data.user?.photo?.mimetype}</p>
                                                    <span
                                                        onClick={handlePreviewPhoto}
                                                        className="text-xs cursor-pointer hover:underline text-(--color-muted)"
                                                    >
                                                        See Photo
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex justify-center items-center gap-4">
                                                <button
                                                    onClick={handleDownloadPhoto}
                                                    className="p-4 bg-(--color-primary) rounded-lg justify-center items-center cursor-pointer hover:bg-red-800"
                                                >
                                                    <Image
                                                        src={icons.download}
                                                        alt="Download Photo"
                                                        height={24}
                                                        width={24}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {isPhotoModalOpen && previewPhoto && (
                                        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
                                            <div className="bg-white w-3/4 h-3/4 rounded-xl p-4 relative">
                                                <div className="items-center justify-between flex mb-5">
                                                    <p className="text-md font-bold">{data.user?.photo?.name}</p>
                                                    <button onClick={handleClosePhotoPreview} className="bg-(--color-primary) rounded-lg p-2 hover:bg-red-800 cursor-pointer">
                                                        <Image
                                                            src={icons.closeMenu}
                                                            alt="Close Preview"
                                                            width={24}
                                                            height={24}
                                                        />
                                                    </button>
                                                </div>
                                                <iframe
                                                    src={previewPhoto ?? undefined}
                                                    className="w-full h-[90%] object-contain rounded-lg"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col mt-6 border-t border-(--color-border) pt-6 gap-6">
                        <button
                            type="button"
                            onClick={() => setOpenProject((prev) => !prev)}
                            className="flex justify-between items-center w-full cursor-pointer"
                        >
                            <h2 className="text-lg font-semibold text-(--color-text-primary)">
                                Project Data Section
                            </h2>
                            <Image
                                src={icons.arrowData}
                                width={20}
                                height={20}
                                alt="Arrow Data"
                                className={`transition-transform duration-300 ${
                                    openProject ? "-rotate-90" : "rotate-0"
                                }`}
                            />
                        </button>
                        {openProject && (
                            <>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Jenis Kontrak</label>
                                    <input
                                        name="jenis"
                                        defaultValue={formData.jenis}
                                        onChange={handleChange}
                                        disabled
                                        className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Nama Project</label>
                                    <input
                                        name="project"
                                        value={data.project?.name ?? ""}
                                        className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        disabled
                                    />
                                    <div className="flex items-center gap-2 mt-2">
                                    <input
                                        type="checkbox"
                                        checked={lockDate}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setLockDate(checked);

                                            setFormData(prev => ({
                                                ...prev,
                                                startDate: checked ? projectStartDate : prev.startDate,
                                                endDate: checked ? projectEndDate : prev.endDate,
                                            }));
                                        }}
                                    />
                                        <span className="text-xs text-gray-600">Samakan dengan startDate dan endDate project</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-600 mb-1">
                                            Tanggal Mulai
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={(e) => {
                                                if (!lockDate) setFormData(prev => ({ ...prev, startDate: e.target.value }));
                                            }}
                                            disabled={lockDate}
                                            className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-600 mb-1">
                                            Tanggal Selesai
                                        </label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={(e) => {
                                                if (!lockDate) setFormData(prev => ({ ...prev, endDate: e.target.value }));
                                            }}
                                            disabled={lockDate}
                                            className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>


                    <div className="flex flex-col mt-6 border-t border-(--color-border) pt-6 gap-6">
                        <button
                            type="button"
                            onClick={() => setOpenAbsensi((prev) => !prev)}
                            className="flex justify-between items-center w-full cursor-pointer"
                        >
                            <h2 className="text-lg font-semibold text-(--color-text-primary)">
                                Pembagian Absensi dan Cuti Bulanan
                            </h2>
                            <Image
                                src={icons.arrowData}
                                width={20}
                                height={20}
                                alt="Arrow Data"
                                className={`transition-transform duration-300 ${
                                    openAbsensi ? "-rotate-90" : "rotate-0"
                                }`}
                            />
                        </button>
                        {openAbsensi && (
                            <>
                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-600">Jumlah Cuti (per bulan)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={formData.cutiBulanan}
                                        onChange={(e) => setFormData({ ...formData, cutiBulanan: Number(e.target.value) })}
                                        className="w-full border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="w-full flex flex-row font-semibold text-sm text-gray-600">
                                        <span className="w-1/3 text-left">Bulan</span>
                                        <span className="w-1/3 text-center">Absensi</span>
                                        <span className="w-1/3 text-right">Cuti</span>
                                    </div>
                                    {monthlyPresence.map((data, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-row text-sm text-gray-700 py-2 border-b"
                                        >
                                            <span className="w-1/3 text-left">{data.bulan}</span>
                                            <span className="w-1/3 text-center">{data.absensi} hari</span>
                                            <span className="w-1/3 text-right">{data.cuti} hari</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col mt-6 border-t border-(--color-border) pt-6 gap-6">
                        <button
                            type="button"
                            onClick={() => setOpenPembayaran((prev) => !prev)}
                            className="flex justify-between items-center w-full cursor-pointer"
                        >
                            <h2 className="text-lg font-semibold text-(--color-text-primary)">
                                Pembayaran Kontrak Kerja
                            </h2>
                            <Image
                                src={icons.arrowData}
                                width={20}
                                height={20}
                                alt="Arrow Data"
                                className={`transition-transform duration-300 ${
                                    openPembayaran ? "-rotate-90" : "rotate-0"
                                }`}
                            />
                        </button>
                        {openPembayaran && (
                            <>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Tipe Pembayaran</label>
                                    <select
                                        name="metodePembayaran"
                                        value={formData.metodePembayaran}
                                        onChange={handleChange}
                                        className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        required
                                    >
                                        <option value="">-- Metode Pembayaran --</option>
                                        {Object.values(MetodePembayaran).map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Nominal Pembayaran (Rp)
                                    </label>
                                    <div className="w-full border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 flex items-center">
                                        <span className="text-gray-600">
                                            Rp
                                        </span>
                                        <input
                                            type="text"
                                            name="totalBayaran"
                                            value={formData.totalBayaran
                                                ? formData.totalBayaran.toLocaleString("id-ID")
                                                : ""}
                                            onChange={handleNominalChange}
                                            className="w-full px-3 py-1 rounded-lg focus:outline-none transition-all"
                                            placeholder="cth: 50.000.000"
                                            required
                                        />
                                    </div>
                                </div>

                                {formData.metodePembayaran === MetodePembayaran.TERMIN && (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex flex-col w-full">
                                                <label className="text-sm font-medium text-gray-600 mb-1">
                                                    Persentase DP (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="dpPercentage"
                                                    value={formData.dpPercentage}
                                                    onChange={handleDPChange}
                                                    min={0}
                                                    max={100}
                                                    className="border border-(--color-border) rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-medium text-gray-600 mb-1">
                                                    Nominal DP
                                                </label>
                                                <input
                                                    type="text"
                                                    disabled
                                                    value={dpNominal.toLocaleString("id-ID", {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    })}
                                                    className="border border-(--color-border) rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-(--color-muted)/30"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex flex-col w-full">
                                                <label className="text-sm font-medium text-gray-600 mb-1">
                                                    Persentase Final (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="finalPercentage"
                                                    value={formData.finalPercentage}
                                                    onChange={() => {}}
                                                    disabled
                                                    className="border border-(--color-border) rounded-lg px-3 py-3 bg-gray-100 text-gray-500"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-medium text-gray-600 mb-1">
                                                    Nominal Final
                                                </label>
                                                <input
                                                    type="text"
                                                    disabled
                                                    value={finalNominal.toLocaleString("id-ID", {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    })}
                                                    className="border border-(--color-border) rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-(--color-muted)/30"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {formData.metodePembayaran === MetodePembayaran.MONTHLY && monthlyPercentages.length > 0 && (
                                    <div>
                                        <div className="flex flex-col gap-4">
                                            <div className="w-full flex flex-row font-semibold text-sm text-gray-600">
                                                <span className="w-1/3 text-left">Bulan</span>
                                                <span className="w-1/3 text-center">Persentase</span>
                                                <span className="w-1/3 text-right">Jumlah</span>
                                            </div>
                                            {monthlyPercentages.map((percent, i) => {
                                                const amount = formData.totalBayaran ? (formData.totalBayaran * percent) / 100 : 0;
                                                return (
                                                    <div
                                                        key={i}
                                                        className="w-full flex flex-row gap-4"
                                                    >
                                                        <label className="w-1/3 text-left text-sm text-gray-600">
                                                            Bulan {i + 1}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={percent}
                                                            className="w-1/3 text-center bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                            disabled
                                                        />
                                                        <input
                                                            type="text"
                                                            disabled
                                                            value={amount.toLocaleString("id-ID", {
                                                                style: "currency",
                                                                currency: "IDR",
                                                            })}
                                                            className="w-1/3 justify-end bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Upload Document Asli (pdf)</label>
                        {documentFiles.length > 0 ? (
                            documentFiles.map((file, index) => (
                                <div key={index} className="flex justify-between items-center rounded-lg p-4 border border-(--color-border) shadow-sm hover:shadow-md transition-shadow bg-white">
                                    <div className="flex flex-row gap-4">
                                        <div className="w-20 h-20 bg-(--color-secondary) rounded-lg items-center justify-center relative">
                                            <Image
                                                src={getFileIcon(file.type)}
                                                fill
                                                alt="Document Format"
                                                className="object-cover p-1 rounded-lg"
                                            />
                                        </div>

                                        <div className="flex flex-col justify-center gap-1">
                                            <p className="text-md font-bold">{file.name}</p>
                                            <p className="text-sm font-medium text-(--color-text-secondary)">{file.type}</p>
                                            <span
                                                onClick={() => handlePreviewFile(index)}
                                                className="text-xs cursor-pointer hover:underline text-(--color-muted)"
                                            >
                                                See File
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-center items-center gap-4">
                                        <input
                                            type="file"
                                            id={`changeDoc-${index}`}
                                            accept="application/pdf"
                                            onChange={(e) => handleChangeDocument(index, e)}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor={`changeDoc-${index}`}
                                            className="text-sm rounded-lg text-white bg-(--color-tertiary) px-3 py-2 cursor-pointer"
                                        >
                                            Change
                                        </label>
                                        <button
                                            onClick={() => handleDeleteDocument(index)}
                                            className="text-sm rounded-lg text-white bg-(--color-primary) px-3 py-2 cursor-pointer hover:bg-red-800"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => handleDownloadFile(index)}
                                            className="p-4 bg-(--color-primary) rounded-lg justify-center items-center cursor-pointer hover:bg-red-800"
                                        >
                                            <Image
                                                src={icons.download}
                                                alt="Download File"
                                                height={24}
                                                width={24}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex justify-between items-center rounded-lg p-4 border border-(--color-border) shadow-sm hover:shadow-md transition-shadow bg-white">
                                <div className="flex flex-row gap-4">
                                    <div className="w-20 h-20 bg-(--color-secondary) rounded-lg items-center justify-center relative"></div>
                                    <div className="flex flex-col justify-center gap-1">
                                        <p className="text-md font-bold">Belum ada dokumen yang diunggah</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {previewDocumentUrl && activePreviewIndex !== null && (
                            <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
                                <div className="bg-white w-3/4 h-3/4 rounded-xl p-4 relative">
                                    <div className="flex justify-between mb-4">
                                        <p className="text-md font-bold">{documentFiles[activePreviewIndex].name}</p>
                                        <button
                                            onClick={() => {
                                                setPreviewDocumentUrl(null);
                                                setActivePreviewIndex(null);
                                            }}
                                            className="rounded-lg p-2 bg-(--color-primary) hover:bg-red-800 cursor-pointer"
                                        >
                                            <Image src={icons.closeMenu} width={24} height={24} alt="Close" />
                                        </button>
                                    </div>

                                    <iframe src={previewDocumentUrl ?? undefined} className="w-full h-[90%] rounded-lg" />
                                </div>
                            </div>
                        )}
                        <input
                            type="file"
                            id="addDocuments"
                            multiple
                            accept="application/pdf"
                            onChange={handleAddDocuments}
                            className="hidden"
                        />
                        <label
                            htmlFor="addDocuments"
                            className="mt-2 flex items-center justify-center text-sm rounded-lg text-(--color-textPrimary) bg-(--color-surface) border-(--color-border) border-2 hover:border-(--color-tertiary) px-4 py-2 cursor-pointer"
                        >
                            Tambah Dokumen
                        </label>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Status Kontrak</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        >
                            <option value="">-- Status Kontrak --</option>
                            {Object.values(KontrakKerjaStatus).map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Catatan Tambahan</label>
                        <textarea
                            name="catatan"
                            value={formData.catatan}
                            onChange={handleChange}
                            placeholder="Masukkan catatan tambahan (opsional)"
                            rows={3}
                            className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        ></textarea>
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
                            {isPending ? "Menyimpan..." : "Simpan Kontrak Kerja"}
                        </button>
                    </div>
                </form>
            </div>
            <ConfirmationPopUpModal
                isOpen={isModalOpen}
                onAction={handleSubmit}
                onClose={() => setIsModalOpen(false)}
                type="success"
                title={"Konfirmasi Pembaruan Kontrak Kerja"}
                message={"Apakah Anda yakin sudah mengisi data dengan baik"}
                activeText={"Simpan"}
                passiveText="Batal"
            />
        </div>  
    );
    return renderHtml;
}