"use client";

import { useEffect, useState } from "react";
import { KontrakKerja, WorkStatus } from "@/app/lib/types/types";
import { dummyKontrakKerja } from "@/app/lib/dummyData/KontrakKerjaData";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { useKontrak } from "@/app/lib/hooks/kontrak/useKontrak";
import { MetodePembayaran } from "@/app/lib/types/enumTypes";
import { fetchFileBlob } from "@/app/lib/path";
import toast from "react-hot-toast";
import CustomToast from "@/app/rootComponents/CustomToast";

export default function KontrakKerjaDetail({ id }: { id: string }) {
    const { data: fetchedData, isLoading, error } = useKontrak().fetchKontrakById(id);
    const [openAbsensi, setOpenAbsensi] = useState(true);
    const [openPembayaran, setOpenPembayaran] = useState(true);
    const [monthlyPercentages, setMonthlyPercentages] = useState<number[]>([]);
    const [monthlyPresence, setMonthlyPresence] = useState<{ bulan: string; absensi: number; cuti: number }[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const router = useRouter();
    const data = fetchedData;

    useEffect(() => {
        if (!data?.startDate || !data.endDate) return;

        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        const cutiBulanan = Number(data.cutiBulanan ?? 0);

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
    }, [data?.startDate, data?.endDate, data?.cutiBulanan]);

    useEffect(() => {
        if (data?.metodePembayaran === MetodePembayaran.MONTHLY && data.startDate && data.endDate) {
            const totalMonths = getMonthDifference(data.startDate, data.endDate);
            if (totalMonths > 0) {
                const equalPercent = 100 / totalMonths
                setMonthlyPercentages(new Array(totalMonths).fill(equalPercent));
            }
        }
    }, [data?.startDate, data?.endDate, data?.metodePembayaran]);

    if (isLoading) {
        return <div className="text-center text-(--color-muted)">Memuat data...</div>;
    }

    if (!fetchedData) {
        return <div className="text-center text-red-500">Data tidak ditemukan.</div>;
    }

    const documents = Array.isArray(data.documents) ? data.documents : [];

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
            toast.custom(<CustomToast type="error" message="Gagal download file"/>);
        }
    };

    const handlePreview = async (path: string) => {
        try {
            const blob = await fetchFileBlob(path);
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
        } catch {
            toast.custom(<CustomToast type="error" message="Gagal memuat file"/>);
        }
    }

    const getFileIcon = (doc: any) => {
        const type = doc?.mimetype;
        if (!type) return icons.pdfFormat;
        if (type === "application/pdf") return icons.pdfFormat;
        if (type.startsWith("image/")) return icons.imageFormat;

        return icons.pdfFormat;
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
                        Detail Kontrak Kerja
                    </h1>
                </div>
                <span className="text-sm text-(--color-muted)">{data.id}</span>
            </div>

            <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                <form className="space-y-6">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Nama Freelancer</label>
                        <input
                            type="text"
                            name="name"
                            value={data.user.name}
                            placeholder="Masukkan nama freelancer"
                            className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled
                        />
                    </div>
    
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Nama Project</label>
                        <input
                            type="text"
                            name="projectName"
                            value={data.project?.name ?? "-"}
                            placeholder="Masukkan nama project"
                            className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            Status Kontrak Kerja
                        </label>
                        <input
                            type="text"
                            name="status"
                            value={data.status ?? ""}
                            placeholder="Status Kontrak Kerja"
                            className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            Jenis Kontrak Kerja
                        </label>
                        <input
                            type="text"
                            name="jenis"
                            value={data.jenis ?? ""}
                            placeholder="Status Kontrak Kerja"
                            className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled
                        />
                    </div>
    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">
                                Tanggal Mulai
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={data.startDate ? data.startDate.substring(0, 10) : ""}
                                className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                disabled
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">
                                Tanggal Selesai
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={data.endDate ? data.endDate.substring(0, 10) : ""} 
                                className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                disabled
                            />
                        </div>
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
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Jumlah Cuti (per bulan)
                                    </label>
                                    <input
                                        type="number"
                                        name="cutiBulanan"
                                        value={data.cutiBulanan}
                                        className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        disabled
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
                                            className="w-full flex flex-row text-sm text-gray-700 py-2 border-b"
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
                                        Tipe Pembayaran
                                    </label>
                                    <input
                                        name="paymentType"
                                        value={data.metodePembayaran}
                                        className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        disabled
                                    />
                                </div>
                
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex flex-col flex-1">
                                        <label className="text-sm font-medium text-gray-600 mb-1">
                                            Total Pembayaran (Rp)
                                        </label>
                                        <div className="w-full bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 flex items-center">
                                            <span className="text-gray-600">
                                                Rp
                                            </span>
                                            <input
                                                type="text"
                                                name="totalBayaran"
                                                value={data.totalBayaran.toLocaleString("id-ID")}
                                                placeholder="cth: 50000000"
                                                className="w-full px-3 py-1 rounded-lg focus:outline-none transition-all"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    {data.metodePembayaran === MetodePembayaran.TERMIN && (
                                        <div className="flex flex-col w-full sm:w-1/3">
                                            <label className="text-sm font-medium text-gray-600 mb-1">
                                                Persentase DP (%)
                                            </label>
                                            <input
                                                type="number"
                                                name="dpPercentage"
                                                value={data.dpPercentage}
                                                className="border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                disabled
                                            />
                                        </div>
                                    )}
                                </div>

                                {data.metodePembayaran === MetodePembayaran.MONTHLY && monthlyPercentages.length > 0 && (
                                    <div>
                                        <div className="flex flex-col gap-4">
                                            <div className="w-full flex flex-row font-semibold text-sm text-gray-600">
                                                <span className="w-1/3 text-left">Bulan</span>
                                                <span className="w-1/3 text-center">Persentase</span>
                                                <span className="w-1/3 text-right">Jumlah</span>
                                            </div>
                                            {monthlyPercentages.map((percent, i) => {
                                                const amount = (data.totalBayaran * percent) / 100 || 0;
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
                                        {/* <p
                                            className={`mt-2 text-sm ${
                                                totalPercentage === 100
                                                    ? "text-green-600"
                                                    : "text-red-500 font-medium"
                                            }`}
                                        >
                                            Total: {totalPercentage}%
                                        </p> */}
                                    </div>
                                )}
                            </> 
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Certification Docs</label>
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
                            <div className="flex flex-col">
                                <input
                                    name="notes"
                                    value={"Belum ada dokumen"}
                                    placeholder="Belum ada dokumen"
                                    className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    disabled
                                ></input>
                            </div>
                        )}
                    </div>
    
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Catatan Tambahan</label>
                        <textarea
                            name="catatan"
                            value={data?.catatan ? data.catatan : "-"}
                            placeholder="Masukkan catatan tambahan (opsional)"
                            rows={3}
                            className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled
                        ></textarea>
                    </div>
                </form>
            </div>
        </div>
    );
}
