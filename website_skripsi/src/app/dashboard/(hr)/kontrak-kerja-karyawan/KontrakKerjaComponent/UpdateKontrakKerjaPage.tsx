"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { icons, logo } from "@/app/lib/assets/assets";
import { KontrakKerjaStatus } from "@/app/lib/types/types";
import { useKontrak } from "@/app/lib/hooks/kontrak/useKontrak";
import { UpdateKontrakKerja } from "@/app/lib/types/kontrak/kontrakTypes";
import { MetodePembayaran } from "@/app/lib/types/enumTypes";
import toast from "react-hot-toast";
import CustomToast from "@/app/rootComponents/CustomToast";
import ConfirmationPopUpModal from "@/app/dashboard/dashboardComponents/allComponents/ConfirmationPopUpModal";
import { fetchFileBlob } from "@/app/lib/path";
import KontrakKerjaSkeletonDetail from "./KontrakKerjaSkeletonDetail";

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
    const [errors, setErrors] = useState({
        metodePembayaran: "",
        totalBayaran: "",
        absensiBulanan: "",
        cutiBulanan: "",
        status: "",
        startDate: "",
        endDate: "",
        contractDocuments: null,
    });
    const [modalState, setModalState] = useState({
        isSuccess: false,
        isError: false,
        errorMessage: ""
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
    const [originalDocuments, setOriginalDocuments] = useState<{filename: string, path: string}[]>([]);

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

            const bulanNama = current.toLocaleString("id-ID", { month: "long", year: "numeric" });

            months.push({
                bulan: bulanNama,
                absensi: totalWorkDays,
                cuti
            });

            current = new Date(year, month + 1, 1);
        }

        setMonthlyPresence(months);
        if (months.length > 0) {
            setFormData(prev => ({
                ...prev,
                absensiBulanan: months[0].absensi
            }));
        }
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
        const documentToDelete = originalDocuments[index];

        if (documentToDelete?.path) {
            setFormData(prev => ({
                ...prev,
                removeDocuments: [...(prev.removeDocuments || []), documentToDelete.path]
            }));
        } else {
            const serverFileCount = originalDocuments.filter(doc => doc.path).length;
            const localIndex = index - serverFileCount;

            setFormData(prev => {
                const newFiles = prev.contractDocuments ? [...prev.contractDocuments] : [];
                newFiles.splice(localIndex, 1);
                return { ...prev, contractDocuments: newFiles };
            });
        }

        setDocumentFiles(prev => prev.filter((_, i) => i !== index));
        setOriginalDocuments(prev => prev.filter((_, i) => i !== index));

        toast.custom(<CustomToast type="success" message="Dokumen ditandai untuk dihapus" />);
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
    
    const getFileIcon = (mimetype: any) => {
        if (!mimetype) return icons.pdfFormat;

        const typeString = typeof mimetype === 'object' ? mimetype.mimetype : mimetype;
        if (typeof typeString !== 'string') return icons.pdfFormat;
        if (typeString.includes("image/")) return icons.imageFormat;
        if (typeString.includes("application/pdf")) return icons.pdfFormat;

        return icons.pdfFormat;
    };

    const handleOpenModal = () => {
        const newErrors = {
            metodePembayaran: "",
            totalBayaran: "",
            absensiBulanan: "",
            cutiBulanan: "",
            status: "",
            startDate: "",
            endDate: "",
            contractDocuments: "",
        };
        let isValid = true;

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

        if (formData.cutiBulanan === undefined || formData.cutiBulanan === null || formData.cutiBulanan < 0) {
            newErrors.cutiBulanan = "Jumlah cuti bulanan harus diisi (minimal 0)";
            isValid = false;
        }

        if (!formData.metodePembayaran) {
            newErrors.metodePembayaran = "Metode pembayaran harus dipilih";
            isValid = false;
        }
        if (!formData.totalBayaran || formData.totalBayaran <= 0) {
            newErrors.totalBayaran = "Nominal pembayaran harus diisi dan lebih dari 0";
            isValid = false;
        }
        if (!formData.status) {
            newErrors.status = "Status kontrak harus dipilih";
            isValid = false;
        }
        if (documentFiles.length === 0) {
            newErrors.contractDocuments = "Minimal satu dokumen kontrak harus diunggah";
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
        mutate({id, kontrakData: formData}, {
            onSuccess: () => {
                setModalState({ isSuccess: true, isError: false, errorMessage: "" });
                setTimeout(() => {
                    setIsModalOpen(false);
                    router.push("/dashboard/kontrak-kerja-karyawan");
                }, 2000);
            },
            onError: (error) => {
                setModalState({ 
                    isSuccess: false, 
                    isError: true, 
                    errorMessage: error.message 
                });
                toast.custom(<CustomToast type="error" message={error.message} />);
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
                const docRefs: {filename: string, path: string}[] = [];

                for (const doc of data.documents) {
                    if (!doc.path) continue;
                    try {
                        const blob = await fetchFileBlob(doc.path);
                        const file = new File([blob], doc.originalname ?? "Unknown", {
                            type: doc.mimetype ?? "application/pdf",
                        });
                        pdfFiles.push(file);
                        docRefs.push({ filename: doc.filename, path: doc.path });
                    } catch (err) {
                        console.error("Load document error:", err);
                    }
                }
                setDocumentFiles(pdfFiles);
                setOriginalDocuments(docRefs);
            }
        };

        loadData();
    }, [data]);

    const dpPercent = formData.dpPercentage ?? 0;
    const finalPercent = 100 - dpPercent;
    const dpNominal = formData.totalBayaran ? (formData.totalBayaran * dpPercent) / 100 : 0;
    const finalNominal = formData.totalBayaran ? (formData.totalBayaran * finalPercent) / 100 : 0;

    if (isLoading) {
        return <KontrakKerjaSkeletonDetail />;
    }

    if (!fetchedData) {
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
                                Detail Kontrak Kerja Tidak Ditemukan
                            </h1>
                            <span className="text-sm text-(--color-primary)">Mohon mengecek kembali detail kontrak kerja nanti</span>
                        </div>
                    </div>
                </div>
            </div>
        );

        return noFetchedData;
    };

    if (error) {
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
                                {error.message ? error.message : "Terdapat kendala pada sistem"}
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
                type="button"
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
                        Update Kontrak Kerja - {data.user.name} - {data.project.name}
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
                                        defaultValue={formData.userData?.name}
                                        className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        disabled
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Email Karyawan</label>
                                    <input
                                        type="text"
                                        name="email"
                                        defaultValue={formData.userData?.email}
                                        className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        disabled
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Major Role</label>
                                    <input
                                        name="majorRole"
                                        defaultValue={formData.userData?.majorRole}
                                        className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        disabled
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Minor Role</label>
                                    <input
                                        name="minorRole"
                                        defaultValue={formData.userData?.minorRole}
                                        className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        disabled
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Upload Foto Karyawan (png, jpeg, jpg)</label>

                                    {previewPhoto ? (
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
                                                    type="button"
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
                                    ) : (
                                        <div className="text-center text-(--color-muted) py-6 italic">
                                            Belum ada dokumen / lampiran pendukung.
                                        </div>
                                    )}
                                    {isPhotoModalOpen && previewPhoto && (
                                        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
                                            <div className="bg-white w-3/4 h-3/4 rounded-xl p-4 relative">
                                                <div className="items-center justify-between flex mb-5">
                                                    <p className="text-md font-bold">{data.user?.photo?.name}</p>
                                                    <button type="button" onClick={handleClosePhotoPreview} className="bg-(--color-primary) rounded-lg p-2 hover:bg-red-800 cursor-pointer">
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
                                            Tanggal Mulai <span className="text-(--color-primary)">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={(e) => {
                                                if (!lockDate) {
                                                    setFormData(prev => ({ ...prev, startDate: e.target.value }));
                                                    setErrors(prev => ({ ...prev, startDate: "" }));
                                                }
                                            }}
                                            disabled={lockDate}
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
                                            Tanggal Selesai <span className="text-(--color-primary)">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={(e) => {
                                                if (!lockDate) {
                                                    setFormData(prev => ({ ...prev, endDate: e.target.value }));
                                                    setErrors(prev => ({ ...prev, endDate: "" }));
                                                }
                                            }}
                                            disabled={lockDate}
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
                                    <label className="text-sm text-gray-600">
                                        Jumlah Cuti (per bulan) <span className="text-(--color-primary)">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={formData.cutiBulanan}
                                        onChange={(e) => {
                                            setFormData({ ...formData, cutiBulanan: Number(e.target.value) });
                                            setErrors(prev => ({ ...prev, cutiBulanan: "" }));
                                        }}
                                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                                            errors.cutiBulanan ? "border-(--color-primary)" : "border-(--color-border)"
                                        }`}
                                    />
                                    {errors.cutiBulanan && (
                                        <p className="text-xs text-(--color-primary) mt-1 animate-in fade-in slide-in-from-top-1">
                                            {errors.cutiBulanan}
                                        </p>
                                    )}
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
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Tipe Pembayaran <span className="text-(--color-primary)">*</span>
                                    </label>
                                    <select
                                        name="metodePembayaran"
                                        value={formData.metodePembayaran}
                                        onChange={handleChange}
                                        className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                                            errors.metodePembayaran ? "border-(--color-primary)" : "border-(--color-border)"
                                        }`}
                                        required
                                    >
                                        <option value="">-- Metode Pembayaran --</option>
                                        {Object.values(MetodePembayaran).map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                    {errors.metodePembayaran && (
                                        <p className="text-xs text-(--color-primary) mt-1 animate-in fade-in slide-in-from-top-1">
                                            {errors.metodePembayaran}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Nominal Pembayaran (Rp) <span className="text-(--color-primary)">*</span>
                                    </label>
                                    <div className={`w-full border rounded-lg px-3 py-2 flex items-center transition-colors ${
                                        errors.totalBayaran ? "border-(--color-primary)" : "border-(--color-border)"
                                    }`}>
                                        <span className="text-gray-600">Rp</span>
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
                                    {errors.totalBayaran && (
                                        <p className="text-xs text-(--color-primary) mt-1 animate-in fade-in slide-in-from-top-1">
                                            {errors.totalBayaran}
                                        </p>
                                    )}
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
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-gray-50 text-(--color-textPrimary) font-semibold border-b border-(--color-border)">
                                                    <tr>
                                                        <th className="px-4 py-3 font-semibold">Bulan</th>
                                                        <th className="px-4 py-3 text-right font-semibold">Jumlah Pembayaran</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 bg-white">
                                                    {monthlyPercentages.map((percent, i) => (
                                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-4 py-3 text-(--color-textPrimary) font-light">
                                                                Bulan {i + 1}
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
                                                                <input
                                                                    type="text"
                                                                    disabled
                                                                    value={formData?.totalBayaran?.toLocaleString("id-ID", {
                                                                        style: "currency",
                                                                        currency: "IDR",
                                                                        minimumFractionDigits: 0,
                                                                    })}
                                                                    className="w-full max-w-[200px] ml-auto text-right rounded-lg px-3 py-1.5 text-(--color-textPrimary) font-light cursor-not-allowed"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-gray-50 border-t border-gray-200">
                                                    <tr>
                                                        <td className="px-4 py-3 font-bold text-gray-800">Total</td>
                                                        <td className="px-4 py-3 text-right font-bold text-(--color-textPrimary)">
                                                            {(Number(formData.totalBayaran ?? 0) * monthlyPercentages.length).toLocaleString("id-ID", {
                                                                style: "currency",
                                                                currency: "IDR",
                                                                minimumFractionDigits: 0,
                                                            })}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className="text-sm font-medium text-gray-600 mb-1">Upload Document Asli (pdf) <span className="text-(--color-primary)">*</span></label>
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
                                            type="button"
                                            onClick={() => handleDeleteDocument(index)}
                                            className="text-sm rounded-lg text-white bg-(--color-primary) px-3 py-2 cursor-pointer hover:bg-red-800"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
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
                            <div className="text-center text-(--color-muted) py-6 italic">
                                Belum ada dokumen / lampiran pendukung.
                            </div>
                        )}
                        {previewDocumentUrl && activePreviewIndex !== null && (
                            <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
                                <div className="bg-white w-3/4 h-3/4 rounded-xl p-4 relative">
                                    <div className="flex justify-between mb-4">
                                        <p className="text-md font-bold">{documentFiles[activePreviewIndex].name}</p>
                                        <button
                                            type="button"
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
                            className={`mt-2 flex items-center justify-center text-sm rounded-lg text-(--color-textPrimary) bg-(--color-surface) border-2 px-4 py-2 cursor-pointer transition-colors
                                ${errors.contractDocuments 
                                    ? "border-(--color-primary) bg-red-50" 
                                    : "border-(--color-border) hover:border-(--color-tertiary)"
                                }`}
                        >
                            Tambah Dokumen
                        </label>

                        {errors.contractDocuments && (
                            <p className="text-xs text-(--color-primary) mt-1 animate-in fade-in slide-in-from-top-1">
                                {errors.contractDocuments}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            Status Kontrak <span className="text-(--color-primary)">*</span>
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
                            <option value="">-- Status Kontrak --</option>
                            {Object.values(KontrakKerjaStatus).map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        {errors.status && (
                            <p className="text-xs text-(--color-primary) mt-1 animate-in fade-in slide-in-from-top-1">
                                {errors.status}
                            </p>
                        )}
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
                onClose={() => {
                    setIsModalOpen(false);
                    setModalState(prev => ({ ...prev, isError: false }));
                }}
                isLoading={isPending}
                isSuccess={modalState.isSuccess}
                isError={modalState.isError}
                errorMessage={modalState.errorMessage}
                type="info"
                title={"Konfirmasi Pembaruan Kontrak Kerja"}
                message={"Apakah Anda yakin sudah mengisi data dengan baik"}
                activeText={"Simpan"}
                passiveText="Batal"
            />
        </div>  
    );
    return renderHtml;
}