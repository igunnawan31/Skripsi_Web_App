"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { icons, logo, photo } from "@/app/lib/assets/assets";
import toast from "react-hot-toast";
import CustomToast from "@/app/rootComponents/CustomToast";
import ConfirmationPopUpModal from "@/app/dashboard/dashboardComponents/allComponents/ConfirmationPopUpModal";
import { useRouter } from "next/navigation";
import { fetchFileBlob } from "@/app/lib/path";
import { useReimburse } from "@/app/lib/hooks/reimburse/useReimburse";
import { ApprovalStatus } from "@/app/lib/types/reimburse/reimburseTypes";
import ReimburseSkeletonDetail from "./ReimburseSkeletonDetail";

export default function ReimburseShowsDetail({ id }: { id: string }) {
    const reimburse = useReimburse();
    const {
        data: detailData,
        isLoading: isDetailLoading,
        error: detailError,
    } = reimburse.fetchReimburseById(id);

    const approveReimburse = useReimburse().approveReimburse();
    const rejectReimburse = useReimburse().rejectReimburse();
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
    const [catatan, setCatatan] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const router = useRouter();
    
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
        if (detailData?.requester?.photo?.path) {
            loadPhoto(detailData.requester.photo.path);
        }
    }, [detailData?.requester?.photo?.path]);
    
    const documents = Array.isArray(detailData?.documents) ? detailData.documents : [];
    
    const getStatusColor = (ct: any) => {
        if (ct.approvalStatus === ApprovalStatus.PENDING) return "bg-yellow-100 text-yellow-800";
        if (ct.approvalStatus === ApprovalStatus.APPROVED) return "bg-green-100 text-green-800";
        if (ct.approvalStatus === ApprovalStatus.REJECTED) return "bg-red-100 text-red-800";
        return "bg-gray-200 text-gray-700";
    };

    const getFileIcon = (doc: any) => {
        const type = doc?.mimetype;
        if (!type) return icons.pdfFormat;
        if (type === "application/pdf") return icons.pdfFormat;
        if (type.startsWith("image/")) return icons.imageFormat;

        return icons.pdfFormat;
    };

    const handleOpenModal = (type: "approve" | "reject") => {
        if (type === "reject" && !catatan.trim()) {
            toast.custom(<CustomToast type="error" message="Catatan harus diisi" />)
            return;
        }

        setActionType(type);
        setIsModalOpen(true);
    };

    const handleConfirmAction = () => {
        if (!detailData || !actionType) return;

        const mutateFn = actionType === "approve" ? approveReimburse : rejectReimburse;
        mutateFn.mutate(
            {id, catatan},
            {
                onSuccess: () => {
                    toast.custom(
                        <CustomToast 
                            type="success" 
                            message={`Reimburse berhasil ${actionType === "approve" ? "disetujui" : "ditolak"}`} 
                        />
                    );
                    setIsModalOpen(false);
                    setTimeout(() => {
                        router.push("/dashboard/pengajuan-reimburse");
                    }, 2000);
                },
                onError: (err: any) => {
                    toast.custom(<CustomToast type="error" message={err.message} />);
                    setIsModalOpen(false);
                },
            }
        )
    }

    const handleDownload = async (path: string, filename: string) => {
        try {
            const blob = await fetchFileBlob(path);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            toast.custom(<CustomToast type="error" message="Gagal download file" />);
        }
    };

    const handlePreview = async (path: string) => {
        try {
            const blob = await fetchFileBlob(path);
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
        } catch {
            toast.custom(<CustomToast type="error" message="Gagal memuat file" />);
        }
    };

    if (isDetailLoading) {
        return <ReimburseSkeletonDetail />
    }

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
                                Detail Reimburse Tidak Ditemukan
                            </h1>
                            <span className="text-sm text-(--color-primary)">Mohon mengecek kembali detail absensi nanti</span>
                        </div>
                    </div>
                </div>
            </div>
        );

        return noFetchedData;
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
                        Detail Reimburse - {detailData.requester.name}
                    </h1>
                </div>
                <span className="text-sm text-(--color-muted)">{detailData.id}</span>
            </div>

            <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="w-full md:w-1/2 flex flex-col items-center text-center gap-4">
                        <div className="relative w-full h-96 aspect-square bg-[--color-tertiary] rounded-xl overflow-hidden">
                            <Image
                                src={previewPhoto || photo.profilePlaceholder}
                                alt="Gambar"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-(--color-text-primary)">
                                {detailData.requester.name}
                            </h2>
                            <p className="text-sm text-(--color-text-secondary)">
                                {detailData.requester.minorRole}
                            </p>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <div className="flex flex-col gap-y-2 text-sm items-start justify-start">
                            <p className="text-sm font-medium text-gray-600 mb-1">Status Reimburse</p>
                            <span
                                className={`px-3 py-2 text-xs font-semibold rounded-lg uppercase text-center w-full
                                ${getStatusColor(
                                    detailData
                                )}`}
                            >
                                {detailData.approvalStatus}
                            </span>

                            <div className="w-full gap-2 flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Judul Pengajuan Reimburse
                                </label>
                                <div
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    {detailData.title}
                                </div>
                            </div>

                            <div className="w-full gap-2 flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Tanggal Pengajuan Reimburse
                                </label>
                                <div
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    {detailData.createdAt ? format(new Date(detailData.createdAt), "dd MMM yyyy") : "-"}
                                </div>
                            </div>

                            <div className="w-full gap-2 flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Total Pengeluaran
                                </label>
                                <div
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    {detailData.totalExpenses.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {!(detailData.approvalStatus === ApprovalStatus.APPROVED && detailData.approvalStatus === ApprovalStatus.REJECTED) ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold text-lg text-(--color-text-primary)">
                                Status Pengajuan Reimburse
                            </h2>
                        </div>
                        <div className="w-full gap-2 flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">
                                Approver
                            </label>
                            <div
                                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            >
                                {detailData.approver?.name ?? "-"}
                            </div>
                        </div>
                        <div className="w-full gap-2 flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">
                                Catatan
                            </label>
                            <div
                                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            >
                                {detailData.catatan ?? "-"}
                            </div>
                        </div>
                        <div className="w-full gap-2 flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">
                                Tanggal Perubahan Status
                            </label>
                            <div
                                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            >
                                {detailData.updatedAt ? format(new Date(detailData.updatedAt), "dd MMM yyyy") : "-"}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div></div>
                )}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold text-lg text-(--color-text-primary)">
                            Lampiran
                        </h2>
                    </div>
                    {documents.length > 0 ? (
                        documents.map((dk: any) => (
                            <div
                                key={dk.path}
                                className="flex justify-between items-center rounded-lg p-4 border border-(--color-border) shadow-sm hover:shadow-md transition-shadow bg-white"
                            >
                                <div className="flex flex-row gap-4">
                                    <div className="w-20 h-20 bg-(--color-secondary) rounded-lg items-center justify-center relative">
                                        <Image
                                            src={getFileIcon(dk)}
                                            fill
                                            alt="PDF Format"
                                            className="object-cover p-4"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center gap-1">
                                        <p className="text-md font-bold">{dk.originalname}</p>
                                        <p className="text-sm font-medium text-(--color-text-secondary)">{dk.filename}</p>
                                        <span
                                            onClick={() => handlePreview(dk.path)}
                                            className="text-xs cursor-pointer hover:underline text-(--color-muted)"
                                        >
                                            See File
                                        </span>
                                    </div>
                                    {previewUrl && (
                                        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
                                            <div className="bg-white w-3/4 h-3/4 rounded-xl p-4 relative">
                                                <div className="items-center justify-between flex mb-5">
                                                    <p className="text-md font-bold">{dk.originalname}</p>
                                                    <button onClick={() => setPreviewUrl(null)} className="bg-(--color-primary) rounded-lg p-2 hover: hover:bg-red-800 cursor-pointer">
                                                        <Image 
                                                            src={icons.closeMenu}
                                                            alt="Close Preview PDF"
                                                            width={24}
                                                            height={24}
                                                        />
                                                    </button>
                                                </div>
                                                <iframe src={previewUrl} className="w-full h-[90%]" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDownload(dk.path, dk.filename)}
                                    className="p-4 bg-(--color-primary) rounded-lg justify-center items-center cursor-pointer hover:bg-red-800"
                                >
                                    <Image
                                        src={icons.download}
                                        alt="Download Button"
                                        height={24}
                                        width={24}
                                    />
                                </button>
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
                </div>
                {detailData.approvalStatus === ApprovalStatus.PENDING && (
                    <div className="mt-6 border-t border-(--color-border) pt-6">
                        <h2 className="text-lg font-semibold text-(--color-text-primary) mb-4">
                            Form Persetujuan Reimburse
                        </h2>
                        <form className="space-y-5">
                            <div>
                                <label
                                    htmlFor="catatan"
                                    className="block mb-2 text-sm font-medium text-(--color-text-secondary)"
                                >
                                    Catatan Penolakan
                                </label>
                                <textarea
                                    name="catatan"
                                    id="catatan"
                                    onChange={(e) => setCatatan(e.target.value)}
                                    className="w-full p-2.5 border border-(--color-border) rounded-lg  text-(--color-text-primary) focus:ring-2 focus:ring-(--color-primary) focus:outline-none transition-all"
                                    placeholder="Anda dapat menyetujui status reimburse dengan memberikan catatan atau (-), atau tolak dengan catatan alasan penolakan"
                                    required
                                />
                            </div>
                        </form>
                    </div>
                )}
                <div className="flex flex-row justify-end items-center gap-4">
                    {detailData.approvalStatus === ApprovalStatus.PENDING && (
                        <div className="flex justify-between gap-3">
                            <button
                                onClick={() => handleOpenModal("approve")}
                                disabled={approveReimburse.isPending}
                                className="w-full px-4 py-2 bg-(--color-success) hover:bg-green-600 text-white rounded-lg transition-colors cursor-pointer"
                            >
                                {approveReimburse.isPending ? "Menyutujui..." : "Setujui"}
                            </button>
                            <button
                                onClick={() => handleOpenModal("reject")}                            
                                disabled={rejectReimburse.isPending}
                                className="w-full px-4 py-2 bg-(--color-primary) hover:bg-red-800 text-white rounded-lg transition-colors cursor-pointer"
                            >
                                {rejectReimburse.isPending ? "Menolak..." : "Tolak"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <ConfirmationPopUpModal
                isOpen={isModalOpen}
                onAction={handleConfirmAction}
                onClose={() => setIsModalOpen(false)}
                type="success"
                title={actionType === "approve" ? "Konfirmasi Persetujuan" : "Konfirmasi Penolakan"}
                message={`Apakah Anda yakin ingin ${actionType === "approve" ? "menyetujui" : "menolak"} reimburse ini?`}
                activeText={actionType === "approve" ? "Setujui" : "Tolak"}
                passiveText="Batal"
            />
        </div>
    );
}
