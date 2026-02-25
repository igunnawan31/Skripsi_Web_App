"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGaji } from "@/app/lib/hooks/gaji/useGaji";
import { PaySalary, SalaryResponse, SalaryStatus } from "@/app/lib/types/gaji/gajiTypes";
import { icons, logo, photo } from "@/app/lib/assets/assets";
import { fetchFileBlob } from "@/app/lib/path";
import toast from "react-hot-toast";
import CustomToast from "@/app/rootComponents/CustomToast";
import Image from "next/image";
import { format } from "date-fns";
import ConfirmationPopUpModal from "@/app/dashboard/dashboardComponents/allComponents/ConfirmationPopUpModal";
import GajiSkeletonDetail from "./GajiSkeletonDetail";

export default function GajiShowsDetail({ id }: { id: string }) {
    const salary = useGaji();
    const router = useRouter();
    
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { mutate, isPending } = useGaji().paySalary();

    const [documentFiles, setDocumentFiles] = useState<File[]>([]);
    const [previewDocumentUrl, setPreviewDocumentUrl] = useState<string | null>(null);
    const [activePreviewIndex, setActivePreviewIndex] = useState<number | null>(null);
    const {
        data: detailData,
        isLoading: isDetailLoading,
        error: detailError,
    } = salary.fetchSalaryById(id);
    const [formData, setFormData] = useState<PaySalary>({
        paychecks: null,
    });

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
        if (detailData?.user?.photo?.path) {
            loadPhoto(detailData.user?.photo.path);
        }
    }, [detailData?.user?.photo?.path]);

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

    const getStatusColor = (sl: SalaryResponse) => {
        const today = new Date();
        const due = new Date(sl.dueDate);

        if (sl.status === SalaryStatus.PENDING && due > today) 
            return "bg-yellow-100 text-yellow-800";

        if (sl.status === SalaryStatus.PAID) 
            return "bg-green-100 text-green-800";

        if (sl.status === SalaryStatus.OVERDUE) 
            return "bg-red-100 text-red-800";

        if (sl.status === SalaryStatus.PENDING && due < today)
            return "bg-red-100 text-red-800";

        return "bg-gray-100 text-gray-700";
    };

    const getStatusReal = (sl: SalaryResponse) => {
        const today = new Date();
        const due = new Date(sl.dueDate);

        if (sl.status === SalaryStatus.PENDING && due < today) {
            return SalaryStatus.OVERDUE
        }
        if (sl.status === SalaryStatus.PENDING && due > today) {
            return SalaryStatus.PENDING
        }
        if (sl.status === SalaryStatus.PAID) {
            return SalaryStatus.PAID
        }
    }

    const getFileIcon = (mimeType?: string) => {
        if (!mimeType) return icons.pdfFormat;

        if (mimeType.startsWith("image/")) return icons.imageFormat;
        if (mimeType === "application/pdf") return icons.pdfFormat;

        return icons.pdfFormat;
    };

    const handleAddDocuments = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        if (files.some(file => file.type !== "application/pdf" && file.type !== "image/png" && file.type !== "image/jpg")) {
            toast.custom(<CustomToast type="error" message="Hanya file png, jpg dan pdf yang diperbolehkan" />);
            return;
        }
        if (files.some(file => file.size > 10 * 1024 * 1024)) {
            toast.custom(<CustomToast type="error" message="Ukuran file maksimal 10MB" />);
            return;
        }

        setDocumentFiles(prev => [...prev, ...files]);

        setFormData(prev => ({
            ...prev,
            paychecks: [...(prev.paychecks || []), ...files]
        }));
    };

    const handleChangeDocument = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.custom(<CustomToast type="error" message="Ukuran file maksimal 10MB" />);
            return;
        }

        setDocumentFiles(prev => {
            const newArr = [...prev];
            newArr[index] = file;
            return newArr;
        });

        setFormData(prev => {
            const currentFiles = prev.paychecks ? [...prev.paychecks] : [];
            currentFiles[index] = file;
            return { ...prev, paychecks: currentFiles };
        });

        toast.custom(<CustomToast type="success" message="Bukti pembayaran berhasil diganti" />);
    };

    const handleDeleteDocument = (index: number) => {
        setDocumentFiles(prev => {
            const copy = [...prev];
            copy.splice(index, 1);
            return copy;
        });

        setFormData(prev => {
            const copy = [...(prev.paychecks || [])];
            copy.splice(index, 1);
            return { ...prev, paychecks: copy };
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

    const handleOpenModal = () => {
        if (!formData.paychecks) {
            toast.custom(<CustomToast type="error" message="Harus ada bukti pembayaran" />)
            return;
        }

        setIsModalOpen(true);
    }

    const handleSubmit = () => {
        mutate({id, salaryData: formData}, {
            onSuccess: () => {
                toast.custom(
                    <CustomToast 
                        type="success" 
                        message={"Salary berhasil dibayar"} 
                    />
                );
                setIsModalOpen(false);
                setTimeout(() => {
                    router.push("/dashboard/gaji-karyawan");
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
            if (!detailData?.paychecks || detailData.paychecks.length === 0) return;

            try {
                const loadedFiles = await Promise.all(
                    detailData.paychecks.map(async (doc: any) => {
                        const blob = await fetchFileBlob(doc.path);
                        return new File([blob], doc.originalname || "document", {
                            type: doc.mimetype,
                        });
                    })
                );

                setDocumentFiles(loadedFiles);
                setFormData(prev => ({ ...prev, paychecks: loadedFiles }));
            } catch (err) {
                console.error("Failed to load existing documents:", err);
            }
        };

        loadData();
    }, [detailData?.paychecks]);

    if (isDetailLoading) {
        return <GajiSkeletonDetail />;
    }

    if (!detailData) {
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
                                Detail Gaji Tidak Ditemukan
                            </h1>
                            <span className="text-sm text-(--color-primary)">Mohon mengecek kembali detail absensi nanti</span>
                        </div>
                    </div>
                </div>
            </div>
        );

        return noFetchedData;
    };

    if (detailError) {
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
                                {detailError.message ? detailError.message : "Terdapat kendala pada sistem"}
                            </h1>
                            <span className="text-sm text-(--color-primary)">Mohon untuk melakukan refresh atau kembali ketika sistem sudah selesai diperbaiki</span>
                        </div>
                    </div>
                </div>
            </div>
        );

        return errorFetchedData;
    };


    return (
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
                        Detail Gaji - {detailData.user.name}
                    </h1>
                </div>
                <span className="text-sm text-(--color-muted)">{detailData.id}</span>
            </div>

            <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="w-full md:w-1/2 flex flex-col items-center text-center gap-4">
                        <div className="relative w-full h-96 aspect-square bg-[--color-tertiary] rounded-xl overflow-hidden">
                            <Image
                                src={previewPhoto || icons.userProfile}
                                alt="Gambar"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-(--color-text-primary)">
                                {detailData.user.name}
                            </h2>
                            <p className="text-sm text-(--color-text-secondary)">
                                {detailData.user.minorRole}
                            </p>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <div className="flex flex-col gap-y-2 text-sm items-start justify-start">
                            <p className="text-sm font-medium text-gray-600 mb-1">Status Gaji</p>
                            <span
                                className={`px-3 py-2 text-xs font-semibold rounded-lg uppercase text-center w-full
                                ${getStatusColor(
                                    detailData
                                )}`}
                            >
                                {getStatusReal(detailData)}
                            </span>

                            <div className="w-full gap-2 flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Tenggat Pembayaran
                                </label>
                                <div
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    {detailData.dueDate ? format(new Date(detailData.dueDate), "dd MMMMMMM yyyy") : "-"}
                                </div>
                            </div>

                            <div className="w-full gap-2 flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Jumlah yang harus dibayarkan
                                </label>
                                <div
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    {detailData.amount.toLocaleString("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    })}
                                </div>
                            </div>
                            
                            {detailData.paymentDate && (
                                <div className="w-full gap-2 flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Tanggal Pembayaran
                                    </label>
                                    <div
                                        className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        {detailData.paymentDate ? format(new Date(detailData.paymentDate), "dd MMM yyyy") : "-"}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-6 border-t border-(--color-border) pt-6">
                    <h2 className="text-lg font-semibold text-(--color-text-primary) mb-4">
                        Form Pembayaran
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="buktiPembayaran"
                                className="block mb-2 text-sm font-medium text-(--color-text-secondary)"
                            >
                                Upload Bukti Pembayaran (jpg/png/pdf) <span className="text-(--color-primary)">*</span>
                            </label>
                                {documentFiles.length > 0 ? (
                                    documentFiles.map((file, index) => (
                                        <div key={index} className="flex justify-between items-center rounded-lg p-4 border border-(--color-border) shadow-sm hover:shadow-md transition-shadow bg-white">
                                            <div className="flex flex-row gap-4">
                                                <div className="w-20 h-20 bg-(--color-secondary) rounded-lg items-center justify-center relative">
                                                    <Image
                                                        src={getFileIcon(file.type)}
                                                        fill
                                                        alt="Photo Format"
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
                                                {detailData.status !== SalaryStatus.PAID && (
                                                    <>
                                                        <input
                                                            type="file"
                                                            id={`changeDoc-${index}`}
                                                            onChange={(e) => handleChangeDocument(index, e)}
                                                            className="hidden"
                                                        />
                                                        <label
                                                            htmlFor={`changeDoc-${index}`}
                                                            className="text-sm rounded-lg text-white bg-(--color-tertiary) hover:bg-yellow-600 px-3 py-2 cursor-pointer"
                                                        >
                                                            {file ? "Change" : "Upload"}
                                                        </label>
                                                        <button
                                                            onClick={() => handleDeleteDocument(index)}
                                                            className="text-sm rounded-lg text-white bg-(--color-primary) px-3 py-2 cursor-pointer hover:bg-red-800"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleDownloadFile(index)}
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
                                        <div className="items-center justify-between flex mb-5">
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
                                        {documentFiles[activePreviewIndex].type === "application/pdf" ? (
                                            <iframe src={previewDocumentUrl} className="w-full h-[90%] object-contain rounded-lg" />
                                        ) : (
                                            <img src={previewDocumentUrl} className="w-full h-[90%] object-contain rounded-lg" />
                                        )}
                                    </div>
                                </div>
                            )}
                            {detailData.status !== SalaryStatus.PAID && (
                                <>
                                    <input
                                        type="file"
                                        id="addDocuments"
                                        multiple
                                        onChange={handleAddDocuments}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="addDocuments"
                                        className="mt-2 flex items-center justify-center text-sm rounded-lg text-(--color-textPrimary) bg-(--color-surface) border-(--color-border) border-2 hover:border-(--color-tertiary) px-4 py-2 cursor-pointer"
                                    >
                                        Tambah Dokumen
                                    </label>
                                </>
                            )}
                        </div>
                        {detailData.status !== SalaryStatus.PAID && (
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
                                    {isPending ? "Menyimpan..." : "Menyimpan Pembayaran"}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
            <ConfirmationPopUpModal
                isOpen={isModalOpen}
                onAction={handleSubmit}
                onClose={() => setIsModalOpen(false)}
                type="success"
                title={"Konfirmasi Pembayaran Salary Karyawan"}
                message={"Apakah Anda yakin sudah mengisi data dengan baik"}
                activeText={"Simpan"}
                passiveText="Batal"
            />
        </div>
    );
}
