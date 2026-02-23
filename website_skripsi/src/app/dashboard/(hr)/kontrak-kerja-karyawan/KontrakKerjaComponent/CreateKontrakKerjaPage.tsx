"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { icons, logo } from "@/app/lib/assets/assets";
import {
    MajorRole,
    MinorRole,
    KontrakKerjaStatus,
} from "@/app/lib/types/types";
import { CreateKontrakKerja } from "@/app/lib/types/kontrak/kontrakTypes";
import { EmployeeType, MetodePembayaran } from "@/app/lib/types/enumTypes";
import { useProject } from "@/app/lib/hooks/project/useProject";
import CustomToast from "@/app/rootComponents/CustomToast";
import { useKontrak } from "@/app/lib/hooks/kontrak/useKontrak";
import toast from "react-hot-toast";
import ConfirmationPopUpModal from "@/app/dashboard/dashboardComponents/allComponents/ConfirmationPopUpModal";
import KontrakKerjaSkeletonDetail from "./KontrakKerjaSkeletonDetail";
import { useUser } from "@/app/lib/hooks/user/useUser";

const CreateKontrakKerjaPage = () => {
    const router = useRouter();

    const [openUserData, setOpenUserData] = useState(true);
    const [openProject, setOpenProject] = useState(true);
    const [openAbsensi, setOpenAbsensi] = useState(true);
    const [openPembayaran, setOpenPembayaran] = useState(true);

    const { data: fetchedDataUsers, isLoading: isLoadingUsers } = useUser().fetchAllUser();
    const users = Array.isArray(fetchedDataUsers?.data) ? fetchedDataUsers.data : [];
    const { mutate, isPending } = useKontrak().createKontrak();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNewUser, setIsNewUser] = useState(true);

    const [formData, setFormData] = useState<CreateKontrakKerja>({
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
    });
    const [errors, setErrors] = useState({
        userData: {
            id: "",
            email: "",
            name: "",
            majorRole: "",
            minorRole: "",
        },
        projectData: {
            id: "",
        },
        jenis: "",
        metodePembayaran: "",
        totalBayaran: "",
        absensiBulanan: "",
        cutiBulanan: "",
        status: "",
        startDate: "",
        endDate: "",
    });

    const [monthlyPercentages, setMonthlyPercentages] = useState<number[]>([]);
    const [monthlyPresence, setMonthlyPresence] = useState<{ bulan: string; absensi: number; cuti: number }[]>([]);

    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

    useEffect(() => {
        return () => {
            documentFiles.forEach(file => URL.revokeObjectURL(file as any));
            if (previewDocumentUrl) URL.revokeObjectURL(previewDocumentUrl);
        };
    }, [documentFiles, previewDocumentUrl]);

    useEffect(() => {
        if (formData.userData.minorRole === MinorRole.HR || 
            formData.userData.minorRole === MinorRole.ADMIN) {
            setFormData(prev => ({
                ...prev,
                projectData: { id: "" },
            }));
            setLockDate(false);
            
            setErrors(prev => ({
                ...prev,
                projectData: { id: "" }
            }));
        }
    }, [formData.userData.minorRole]);

    const getMonthDifference = (startDate: string, endDate: string): number => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const years = end.getFullYear() - start.getFullYear();
        const months = end.getMonth() - start.getMonth();
        return years * 12 + months + 1;
    };

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

    const selectedExistingUser = !isNewUser 
    ? users.find((u: any) => u.id === formData.userData.id) 
    : null;

    const currentMinorRole = isNewUser 
        ? formData.userData.minorRole 
        : selectedExistingUser?.minorRole;

    const isHRorAdmin = currentMinorRole === "HR" || currentMinorRole === "ADMIN";

    const handleDPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Math.max(Number(e.target.value), 0), 100);
        setFormData(prev => ({
            ...prev,
            dpPercentage: value,
            finalPercentage: 100 - value,
        }));
    };

    const { data: fetchedDataProject, isLoading, error } = useProject().fetchAllProject();
    const project = Array.isArray(fetchedDataProject?.data) ? fetchedDataProject.data : [];
    
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
            toast.custom(
                <CustomToast 
                    type="error" 
                    message={"Hanya PNG, JPEG, atau JPG yang diperbolehkan untuk foto"} 
                />
            );
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.custom(
                <CustomToast 
                    type="error" 
                    message={"Ukuran File terlalu besar (maks 5MB)"} 
                />
            );
            return;
        }
        setPhotoFile(file);
        const url = URL.createObjectURL(file);
        setPreviewPhoto(url);
        setFormData(prev => ({
            ...prev,
            userPhoto: file
        }));
    };

    const handlePreviewPhoto = () => {
        if (!previewPhoto) return;
        setPreviewUrl(previewPhoto);
    }

    const handleDownloadPhoto = () => {
        if (!photoFile || !previewPhoto) return;
        const a = document.createElement("a");
        a.href = previewPhoto;
        a.download = photoFile.name;
        a.click();
    }

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

    const getFileIcon = (mimetype: any) => {
        if (!mimetype) return icons.pdfFormat;

        const typeString = typeof mimetype === 'object' ? mimetype.mimetype : mimetype;
        if (typeof typeString !== 'string') return icons.pdfFormat;
        if (typeString.includes("image/")) return icons.imageFormat;
        if (typeString.includes("application/pdf")) return icons.pdfFormat;

        return icons.pdfFormat;
    };

    const dpPercent = formData.dpPercentage ?? 0;
    const finalPercent = 100 - dpPercent;
    const dpNominal = (formData.totalBayaran * dpPercent) / 100;
    const finalNominal = (formData.totalBayaran * finalPercent) / 100;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (lockDate && (name === "startDate" || name === "endDate")) return;

        setFormData(prev => ({
            ...prev,
            [name]: name === "metodePembayaran" ? (value as MetodePembayaran) : 
                    name === "totalBayaran" ? Number(value) : value
        }));

        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    };

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            userData: {
                ...prev.userData,
                [name]: value
            }
        }));

        setErrors(prev => ({
            ...prev,
            userData: {
                ...prev.userData,
                [name]: ""
            }
        }));
    };

    const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^\d]/g, "");
        setFormData(prev => ({ ...prev, totalBayaran: Number(raw) }));

        setErrors(prev => ({ ...prev, totalBayaran: "" }));
    };

    const handleOpenModal = () => {
        const newErrors = {
            userData: {
                id: "",
                email: "",
                name: "",
                majorRole: "",
                minorRole: "",
            },
            projectData: {
                id: "",
            },
            jenis: "",
            metodePembayaran: "",
            totalBayaran: "",
            absensiBulanan: "",
            cutiBulanan: "",
            status: "",
            startDate: "",
            endDate: "",
        };
        let isValid = true;

        if (isNewUser) {
            if (!formData.userData.name?.trim()) {
                newErrors.userData.name = "Nama karyawan harus diisi";
                isValid = false;
            }
            if (!formData.userData.email?.trim()) {
                newErrors.userData.email = "Email karyawan harus diisi";
                isValid = false;
            }
            if (!formData.userData.minorRole) {
                newErrors.userData.minorRole = "Minor role harus dipilih";
                isValid = false;
            }
        } else {
            if (!formData.userData.id) {
                newErrors.userData.id = "Karyawan harus dipilih";
                isValid = false;
            }
        }

        if (!formData.jenis) {
            newErrors.jenis = "Jenis kontrak harus dipilih";
            isValid = false;
        }
        
        const userMinorRole = isNewUser 
            ? formData.userData.minorRole 
            : users.find((u: any) => u.id === formData.userData.id)?.minorRole;
        
        const isHRorAdmin = userMinorRole === MinorRole.HR || 
                            userMinorRole === MinorRole.ADMIN;
        
        if (!isHRorAdmin && !formData.projectData?.id) {
            newErrors.projectData.id = "Project harus dipilih";
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

        setErrors(newErrors);

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
    };

    const handleSubmit = () => {
        mutate(formData, {
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

    if (isLoading || isLoadingUsers) {
        return <KontrakKerjaSkeletonDetail />;
    }


    if (!fetchedDataProject) {
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
                        Buat Kontrak Kerja Baru
                    </h1>
                </div>
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
                                <div className="flex gap-4 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsNewUser(true);
                                            setFormData(prev => ({
                                                ...prev,
                                                userData: {
                                                    email: "",
                                                    name: "",
                                                    password: "Rahasia123",
                                                    majorRole: MajorRole.KARYAWAN,
                                                    minorRole: "",
                                                }
                                            }));
                                        }}
                                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                                            isNewUser
                                                ? "bg-(--color-primary) text-white"
                                                : "bg-white text-gray-700 border border-gray-300"
                                        }`}
                                    >
                                        New User
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsNewUser(false);
                                            setFormData(prev => ({
                                                ...prev,
                                                userData: {
                                                    id: ""
                                                }
                                            }));
                                        }}
                                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                                            !isNewUser
                                                ? "bg-(--color-primary) text-white"
                                                : "bg-white text-gray-700 border border-gray-300"
                                        }`}
                                    >
                                        Existing User
                                    </button>
                                </div>

                                {isNewUser ? (
                                    <>
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-600 mb-1">
                                                Nama Karyawan <span className="text-(--color-primary)">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.userData.name || ""}
                                                onChange={handleUserChange}
                                                placeholder="Masukkan nama karyawan"
                                                className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                                                    errors.userData.name ? "border-(--color-primary)" : "border-(--color-border)"
                                                }`}
                                                required
                                            />
                                            {errors.userData.name && (
                                                <p className="text-xs text-(--color-primary) mt-1 animate-in fade-in slide-in-from-top-1">
                                                    {errors.userData.name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-600 mb-1">
                                                Email Karyawan <span className="text-(--color-primary)">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.userData.email || ""}
                                                onChange={handleUserChange}
                                                placeholder="Masukkan email karyawan"
                                                className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                                                    errors.userData.email ? "border-(--color-primary)" : "border-(--color-border)"
                                                }`}
                                                required
                                            />
                                            {errors.userData.email && (
                                                <p className="text-xs text-(--color-primary) mt-1 animate-in fade-in slide-in-from-top-1">
                                                    {errors.userData.email}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-600 mb-1">
                                                Major Role <span className="text-(--color-primary)">*</span>
                                            </label>
                                            <input
                                                name="majorRole"
                                                value={MajorRole.KARYAWAN}
                                                onChange={handleUserChange}
                                                className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                                                    errors.userData.majorRole ? "border-(--color-primary)" : "border-(--color-border)"
                                                }`}
                                                required
                                                disabled
                                            />
                                            {errors.userData.majorRole && (
                                                <p className="text-xs text-(--color-primary) mt-1 animate-in fade-in slide-in-from-top-1">
                                                    {errors.userData.majorRole}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-600 mb-1">
                                                Minor Role <span className="text-(--color-primary)">*</span>
                                            </label>
                                            <select
                                                name="minorRole"
                                                value={formData.userData.minorRole || ""}
                                                onChange={handleUserChange}
                                                className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                                                    errors.userData.minorRole ? "border-(--color-primary)" : "border-(--color-border)"
                                                }`}
                                                required
                                            >
                                                <option value="">-- Minor Role --</option>
                                                {Object.values(MinorRole).map(role => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                            {errors.userData.minorRole && (
                                                <p className="text-xs text-(--color-primary) mt-1 animate-in fade-in slide-in-from-top-1">
                                                    {errors.userData.minorRole}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-600 mb-1">
                                                Upload Foto Karyawan (png, jpeg, jpg) (opsional)
                                            </label>
                                            {photoFile ? (
                                                <div className="flex justify-between items-center rounded-lg p-4 border border-(--color-border) shadow-sm hover:shadow-md transition-shadow bg-white">
                                                    <div className="flex flex-row gap-4">
                                                        <div className="w-20 h-20 bg-(--color-secondary) rounded-lg items-center justify-center relative">
                                                            <Image
                                                                src={getFileIcon(photoFile.type)}
                                                                fill
                                                                alt="Photo Format"
                                                                className="object-cover p-1 rounded-lg"
                                                            />
                                                        </div>

                                                        <div className="flex flex-col justify-center gap-1">
                                                            <p className="text-md font-bold">{photoFile.name}</p>
                                                            <p className="text-sm font-medium text-(--color-text-secondary)">{photoFile.type}</p>
                                                            <span
                                                                onClick={handlePreviewPhoto}
                                                                className="text-xs cursor-pointer hover:underline text-(--color-muted)"
                                                            >
                                                                See Photo
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-center items-center gap-4">
                                                        <input
                                                            type="file"
                                                            id="photoUpload"
                                                            onChange={handlePhotoUpload}
                                                            className="hidden"
                                                        />
                                                        <label
                                                            htmlFor="photoUpload"
                                                            className="text-sm rounded-lg text-(--color-surface) bg-(--color-primary) p-4 cursor-pointer"
                                                        >
                                                            {photoFile ? "Change" : "Upload"}
                                                        </label>
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
                                            ) : (
                                                <div className="flex justify-between items-center rounded-lg p-4 border border-(--color-border) shadow-sm hover:shadow-md transition-shadow bg-white">
                                                    <div className="flex flex-row gap-4">
                                                        <div className="w-20 h-20 bg-(--color-secondary) rounded-lg items-center justify-center relative"></div>
                                                        <div className="flex flex-col justify-center gap-1">
                                                            <p className="text-md font-bold">Nama File</p>
                                                            <p className="text-sm font-medium text-(--color-text-secondary)">Tipe File</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="file"
                                                            id="photoUpload"
                                                            onChange={handlePhotoUpload}
                                                            className="hidden"
                                                        />
                                                        <label
                                                            htmlFor="photoUpload"
                                                            className="text-sm rounded-lg text-(--color-surface) bg-(--color-primary) p-4 cursor-pointer"
                                                        >
                                                            {photoFile ? "Change" : "Upload"}
                                                        </label>
                                                    </div>
                                                </div>
                                            )}
                                            {previewUrl && (
                                                <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
                                                    <div className="bg-white w-3/4 h-3/4 rounded-xl p-4 relative">
                                                        <div className="items-center justify-between flex mb-5">
                                                            <p className="text-md font-bold">{photoFile?.name}</p>
                                                            <button onClick={() => setPreviewUrl(null)} className="bg-(--color-primary) rounded-lg p-2 hover:bg-red-800 cursor-pointer">
                                                                <Image
                                                                    src={icons.closeMenu}
                                                                    alt="Close Preview"
                                                                    width={24}
                                                                    height={24}
                                                                />
                                                            </button>
                                                        </div>
                                                        <img src={previewUrl} className="w-full h-[90%] object-contain rounded-lg" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-600 mb-1">
                                                Pilih Karyawan <span className="text-(--color-primary)">*</span>
                                            </label>
                                            <select
                                                name="userId"
                                                value={formData.userData.id || ""}
                                                onChange={(e) => {
                                                    const userId = e.target.value;
                                                    const selectedUser = users.find((u: any) => u.id === userId);
                                                    
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        userData: { id: userId }
                                                    }));

                                                    if (selectedUser) {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            userData: { 
                                                                id: userId,
                                                            }
                                                        }));
                                                    }

                                                    setErrors(prev => ({
                                                        ...prev,
                                                        userData: {
                                                            ...prev.userData,
                                                            id: ""
                                                        }
                                                    }));
                                                }}
                                                className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                                                    errors.userData.id ? "border-(--color-primary)" : "border-(--color-border)"
                                                }`}
                                                required
                                            >
                                                <option value="">-- Pilih Karyawan --</option>
                                                {users.map((user: any) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name} - {user.email} ({user.minorRole})
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.userData.id && (
                                                <p className="text-xs text-(--color-primary) mt-1 animate-in fade-in slide-in-from-top-1">
                                                    Karyawan harus dipilih
                                                </p>
                                            )}
                                        </div>

                                        {formData.userData.id && (
                                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                <p className="text-sm text-blue-800">
                                                    <strong>Info:</strong> Kontrak akan dibuat untuk karyawan yang sudah terdaftar.
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
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
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Jenis Kontrak <span className="text-(--color-primary)">*</span>
                                    </label>
                                    <select
                                        name="jenis"
                                        value={formData.jenis}
                                        onChange={handleChange}
                                        className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                                            errors.jenis ? "border-(--color-primary)" : "border-(--color-border)"
                                        }`}
                                    >
                                        <option value="">-- Jenis Kontrak --</option>
                                        {Object.values(EmployeeType).map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                    {errors.jenis && (
                                        <p className="text-xs text-(--color-primary) mt-1 animate-in fade-in slide-in-from-top-1">
                                            {errors.jenis}
                                        </p>
                                    )}
                                </div>

                                {formData.userData.minorRole !== MinorRole.HR && 
                                    formData.userData.minorRole !== MinorRole.ADMIN && !isHRorAdmin && (
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-600 mb-1">
                                                Nama Project <span className="text-(--color-primary)">*</span>
                                            </label>
                                            <select
                                                name="project"
                                                value={formData.projectData?.id ?? ""}
                                                onChange={(e) => {
                                                    const selected = project.find((p: any) => p.id === e.target.value);
                                                    if (selected) {
                                                        const sDate = selected.startDate.split("T")[0];
                                                        const eDate = selected.endDate.split("T")[0];
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            projectData: { id: selected.id },
                                                            startDate: lockDate ? sDate : prev.startDate,
                                                            endDate: lockDate ? eDate : prev.endDate,
                                                        }));
                                                        
                                                        setErrors(prev => ({
                                                            ...prev,
                                                            projectData: { id: "" }
                                                        }));
                                                    }
                                                }}
                                                className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                                                    errors.projectData.id ? "border-(--color-primary)" : "border-(--color-border)"
                                                }`}
                                                required
                                            >
                                                <option value="">-- Pilih Project --</option>
                                                {project.map((project: any) => (
                                                    <option key={project.id} value={project.id}>
                                                        {project.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.projectData.id && (
                                                <p className="text-xs text-(--color-primary) mt-1 animate-in fade-in slide-in-from-top-1">
                                                    {errors.projectData.id}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 mt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={lockDate}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        setLockDate(checked);

                                                        const selected = project.find((p: any) => p.id === formData.projectData.id);
                                                        if (!selected) return;

                                                        const sDate = selected.startDate.split("T")[0];
                                                        const eDate = selected.endDate.split("T")[0];

                                                        setFormData(prev => ({
                                                            ...prev,
                                                            startDate: checked ? sDate : "",
                                                            endDate: checked ? eDate : "",
                                                        }));
                                                    }}
                                                />
                                                <span className="text-xs text-gray-600">Samakan dengan startDate dan endDate project</span>
                                            </div>
                                        </div>
                                    )
                                }

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
                                            <div className="w-full flex flex-row font-semibold text-sm text-gray-600">
                                                <span className="w-1/3 text-left">Bulan</span>
                                                <span className="w-1/3 text-center">Persentase</span>
                                                <span className="w-1/3 text-right">Jumlah</span>
                                            </div>
                                            {monthlyPercentages.map((percent, i) => {
                                                const amount = (formData.totalBayaran * percent) / 100 || 0;
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
                    <div className="flex flex-col gap-4">
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
                onClose={() => setIsModalOpen(false)}
                type="success"
                title={"Konfirmasi Pembuatan Kontrak Kerja"}
                message={"Apakah Anda yakin sudah mengisi data dengan baik"}
                activeText={"Simpan"}
                passiveText="Batal"
            />
        </div>
    );

    return renderHtml;
};

export default CreateKontrakKerjaPage;
