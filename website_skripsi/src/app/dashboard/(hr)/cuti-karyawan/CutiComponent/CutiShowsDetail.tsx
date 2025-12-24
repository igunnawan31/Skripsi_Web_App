"use client";

import { useEffect, useState } from "react";
import { Cuti, CutiStatus } from "@/app/lib/types/types";
import Link from "next/link";
import { useCuti } from "@/app/lib/hooks/cuti/useCuti";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import { icons, photo } from "@/app/lib/assets/assets";
import toast from "react-hot-toast";
import CustomToast from "@/app/rootComponents/CustomToast";
import ConfirmationPopUpModal from "@/app/dashboard/dashboardComponents/allComponents/ConfirmationPopUpModal";
import { useRouter } from "next/navigation";
import { fetchFileBlob } from "@/app/lib/path";

export default function CutiShowsDetail({ id }: { id: string }) {
    const cuti = useCuti();
    const {
        data: detailData,
        isLoading: isDetailLoading,
        error: detailError,
    } = cuti.fetchCutiById(id);

    const {
        data: historyData,
        isLoading: isHistoryLoading,
        error: historyError,
    } = cuti.fetchCutiByUserId(detailData?.userId ?? "");

    const approveCuti = useCuti().approveCuti();
    const rejectCuti = useCuti().rejectCuti();
    const [catatan, setCatatan] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const router = useRouter();

    const computeTotalDays = (startStr?: string, endStr?: string) => {
        if (!startStr || !endStr) return 0;
        try {
            const start = parseISO(startStr);
            const end = parseISO(endStr);
            const msPerDay = 24 * 60 * 60 * 1000;
            const diff = Math.floor((end.getTime() - start.getTime()) / msPerDay);
            return diff >= 0 ? diff + 1 : 0;
        } catch {
            return 0;
        }
    };

    const getStatusColor = (ct: any) => {
        if (ct.status === CutiStatus.MENUNGGU) return "bg-yellow-100 text-yellow-800";
        if (ct.status === CutiStatus.DITERIMA) return "bg-green-100 text-green-800";
        if (ct.status === CutiStatus.DITOLAK) return "bg-red-100 text-red-800";
        return "bg-gray-200 text-gray-700";
    };

    const getFileIcon = (doc: any) => {
        const type = doc?.mimetype;
        if (!type) return icons.pdfFormat;
        if (type === "application/pdf") return icons.pdfFormat;
        if (type.startsWith("image/")) return icons.imageFormat;

        return icons.pdfFormat;
    };

    if (isDetailLoading || isHistoryLoading) {
        return <div className="text-center text-(--color-muted)">Memuat data...</div>;
    }

    if (detailError || historyError) {
        return <div className="text-center text-red-500">Terjadi kesalahan.</div>;
    }

    if (!detailData) {
        return <div className="text-center text-red-500">Data tidak ditemukan.</div>;
    }

    const data = detailData;
    const history = (historyData?.data ?? []).filter((ct: any) => ct.id !== data.id).slice(0,7);
    const documents = data.dokumen ? [data.dokumen] : [];
    const days = computeTotalDays(data.startDate, data.endDate);

    const handleOpenModal = (type: "approve" | "reject") => {
        if (!catatan.trim()) {
            toast.custom(<CustomToast type="error" message="Catatan harus diisi" />)
            return;
        }

        setActionType(type);
        setIsModalOpen(true);
    };

    const handleConfirmAction = () => {
        if (!data || !actionType) return;

        const mutateFn = actionType === "approve" ? approveCuti : rejectCuti;
        mutateFn.mutate(
            {id: data.id, catatan},
            {
                onSuccess: () => {
                    toast.custom(
                        <CustomToast 
                            type="success" 
                            message={`Cuti berhasil ${actionType === "approve" ? "disetujui" : "ditolak"}`} 
                        />
                    );
                    setIsModalOpen(false);
                    setTimeout(() => {
                        router.push("/dashboard/cuti-karyawan");
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
                        Detail Cuti
                    </h1>
                </div>
                <span className="text-sm text-(--color-muted)">{data.id}</span>
            </div>

            <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="w-full md:w-1/2 flex flex-col items-center text-center gap-4">
                        <div className="relative w-full h-96 aspect-square bg-[--color-tertiary] rounded-xl overflow-hidden">
                            <Image
                                src={photo.profilePlaceholder}
                                alt="Gambar"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-(--color-text-primary)">
                                {data.user.name}
                            </h2>
                            <p className="text-sm text-(--color-text-secondary)">
                                {data.user.minorRole}
                            </p>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <div className="flex flex-col gap-y-2 text-sm items-start justify-start">
                            <p className="text-sm font-medium text-gray-600 mb-1">Status Cuti</p>
                            <span
                                className={`px-3 py-2 text-xs font-semibold rounded-lg uppercase text-center w-full
                                ${getStatusColor(
                                    data
                                )}`}
                            >
                                {data.status}
                            </span>

                            <div className="w-full gap-2 flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Tanggal Mulai
                                </label>
                                <div
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    {data.startDate ? format(new Date(data.startDate), "dd MMM yyyy") : "-"}
                                </div>
                            </div>

                            <div className="w-full gap-2 flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Tanggal Mulai
                                </label>
                                <div
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    {data.endDate ? format(new Date(data.endDate), "dd MMM yyyy") : "-"}
                                </div>
                            </div>

                            <div className="w-full gap-2 flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Alasan
                                </label>
                                <div
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    {data.reason}
                                </div>
                            </div>

                            <div className="w-full gap-2 flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Total Hari
                                </label>
                                <div
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    {days}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                        <div className="text-center text-(--color-muted) py-6">
                            Belum ada riwayat cuti lainnya.
                        </div>
                    )}
                </div>
                <div className="mt-6 border-t border-(--color-border) pt-6">
                    <h2 className="text-lg font-semibold text-(--color-text-primary) mb-4">
                        Form Persetujuan Cuti
                    </h2>
                    <form className="space-y-5">
                        <div>
                            <label
                                htmlFor="catatan"
                                className="block mb-2 text-sm font-medium text-(--color-text-secondary)"
                            >
                                Catatan <span className="text-(--color-primary)">*</span>
                            </label>
                            <textarea
                                name="notes"
                                id="catatan"
                                onChange={(e) => setCatatan(e.target.value)}
                                className="w-full p-2.5 border border-(--color-border) rounded-lg  text-(--color-text-primary) focus:ring-2 focus:ring-(--color-primary) focus:outline-none transition-all"
                                placeholder="Anda diperbolehkan untuk cuti, jika ...."
                                required
                            />
                        </div>
                    </form>
                </div>
                <div className="flex flex-row justify-end items-center gap-4">
                    {data.status === CutiStatus.MENUNGGU && (
                        <div className="flex justify-between gap-3">
                            <button
                                onClick={() => handleOpenModal("approve")}
                                disabled={approveCuti.isPending}
                                className="w-full px-4 py-2 bg-(--color-success) hover:bg-green-600 text-white rounded-lg transition-colors cursor-pointer"
                            >
                                {approveCuti.isPending ? "Menyutujui..." : "Setujui"}
                            </button>
                            <button
                                onClick={() => handleOpenModal("reject")}                            
                                disabled={rejectCuti.isPending}
                                className="w-full px-4 py-2 bg-(--color-primary) hover:bg-red-800 text-white rounded-lg transition-colors cursor-pointer"
                            >
                                {rejectCuti.isPending ? "Menolak..." : "Tolak"}
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-4 mt-6">
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold text-lg text-(--color-text-primary)">
                            Riwayat Cuti
                        </h2>
                    </div>
                    {history.length > 0 ? (
                        history.map((ct: any) => (
                            <div
                                key={ct.id}
                                className="flex flex-col p-4 sm:p-5 lg:p-6
                                        group bg-(--color-surface) border border-(--color-border)
                                        rounded-2xl shadow-sm hover:shadow-md
                                        hover:-translate-y-1 transition-all duration-200"
                            >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center
                                                gap-1 text-xs sm:text-sm
                                                text-(--color-textPrimary)
                                                border-b border-(--color-border)
                                                pb-2">
                                    <span className="text-(--color-muted) break-all">
                                        {ct.id}
                                    </span>
                                    <span
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg uppercase text-center w-fit 
                                        ${getStatusColor(
                                            ct
                                        )}`}
                                    >
                                        {ct.status}
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 py-3">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm sm:text-base font-semibold text-(--color-textPrimary) truncate max-w-[220px] sm:max-w-none">
                                            {ct.reason}
                                        </p>
                                        <p className="text-sm text-(--color-text-secondary)">Total Cuti: {days} Hari</p>
                                        <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-5">
                                            <div className="text-sm text-gray-500 flex gap-2 items-center justify-center">
                                                <Image
                                                    src={icons.dateIn}
                                                    alt="Tanggal Mulai Cuti"
                                                    width={24}
                                                    height={24}
                                                />
                                                {ct.startDate ? format(new Date(ct.startDate), "dd MMM yyyy") : "-"}
                                            </div>
                                            <div className="text-sm text-gray-500 flex gap-2 items-center justify-center">
                                                <Image
                                                    src={icons.dateOut}
                                                    alt="Tanggal Berakhir Cuti"
                                                    width={24}
                                                    height={24}
                                                />
                                                {ct.endDate ? format(new Date(ct.endDate), "dd MMM yyyy") : "-"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <Link
                                            href={`/dashboard/cuti-karyawan/${ct.id}`}
                                            className="flex items-center justify-center gap-2 p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer"
                                        >
                                            <Image
                                                src={icons.viewLogo}
                                                alt="View Logo"
                                                width={20}
                                                height={20}
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-(--color-muted) py-6">
                            Belum ada riwayat cuti lainnya.
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
                message={`Apakah Anda yakin ingin ${actionType === "approve" ? "menyetujui" : "menolak"} cuti ini?`}
                activeText={actionType === "approve" ? "Setujui" : "Tolak"}
                passiveText="Batal"
            />
        </div>
    );
}
