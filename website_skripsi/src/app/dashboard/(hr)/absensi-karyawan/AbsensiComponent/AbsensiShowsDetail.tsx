"use client";

import { useEffect, useState } from "react";
import { useAbsensi } from "@/app/lib/hooks/absensi/useAbsensi";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import { icons, photo } from "@/app/lib/assets/assets";
import { fetchFileBlob } from "@/app/lib/path";
import toast from "react-hot-toast";
import CustomToast from "@/app/rootComponents/CustomToast";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet"; 
import Link from "next/link";
import { fromZonedTime } from "date-fns-tz";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function AbsensiShowsDetail({ id }: { id: string }) {
    const absensi = useAbsensi();
    const router = useRouter();
    const searchParams = useSearchParams();
    const date = searchParams.get("date") || "";
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const {
        data: detailData,
        isLoading: isDetailLoading,
        error: detailError,
    } = absensi.fetchAbsensiById(id, date);

    let current = new Date();
    const year = current.getFullYear();
    const month = current.getMonth();

    const {
        data: historyData,
        isLoading: isHistoryLoading,
        error: historyError,
    } = absensi.fetchAbsensiByUserId(id, year, month);

    if (isDetailLoading || isHistoryLoading) {
        return <div className="text-center text-(--color-muted)">Memuat data...</div>;
    }

    if (detailError || historyError) {
        return <div className="text-center text-red-500">Terjadi kesalahan.</div>;
    }

    if (!detailData || !historyData) {
        return <div className="text-center text-red-500">Data tidak ditemukan.</div>;
    }

    const getTimeFromISO = (iso?: string) => {
        if (!iso) return "-";
        return iso.split("T")[1]?.substring(0, 5);
    };

    const getFileIcon = (doc: any) => {
        const type = doc?.mimetype;
        if (!type) return icons.pdfFormat;
        if (type === "application/pdf") return icons.pdfFormat;
        if (type.startsWith("image/")) return icons.imageFormat;

        return icons.pdfFormat;
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

    const getCheckInStatus = (checkIn?: string) => {
        if (!checkIn) return "-";

        const checkInWIB = fromZonedTime(checkIn, "Asia/Jakarta");
        const limit = new Date(checkInWIB);
        limit.setUTCHours(8, 30, 0, 0);

        return checkInWIB > limit ? "Terlambat" : "Tepat Waktu";
    };

    const getStatusColor = (absen: any) => {
        if (getCheckInStatus(absen.checkIn) === "Tepat Waktu") return "bg-green-100 text-green-800";
        if (getCheckInStatus(absen.checkIn) === "Terlambat") return "bg-red-100 text-red-800";
        return "bg-gray-100 text-gray-700";
    };

    // const lastShownHistory = historyData?.data.slice(0,7) ?? []; 
    const lastShownHistory = (historyData?.data ?? []).filter((abs: any) => (abs.user.id !== detailData.user.id && abs.checkIn !== detailData.checkIn)).slice(0,7);

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
                        Detail Absensi
                    </h1>
                </div>
                <span className="text-sm text-(--color-muted)">ID: {detailData.user.id} - {detailData.checkIn ? format(new Date(detailData.checkIn), "dd MMM yyyy") : "-"}</span>
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
                                {detailData.user.name}
                            </h2>
                            <p className="text-sm text-(--color-text-secondary)">
                                {detailData.user.minorRole}
                            </p>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <div className="flex flex-col gap-y-2 text-sm items-start justify-start">
                            <div className="w-full gap-2 flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Tanggal Mulai
                                </label>
                                <div
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    {detailData.checkIn ? format(new Date(detailData.checkIn), "dd MMM yyyy") : "-"}
                                </div>
                            </div>

                            <div className="w-full gap-2 flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Check In
                                </label>
                                <div
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    {getTimeFromISO(detailData.checkIn)}
                                </div>
                            </div>

                            <div className="w-full gap-2 flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Check Out
                                </label>
                                <div
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    {getTimeFromISO(detailData.checkOut)}
                                </div>
                            </div>


                            <div className="w-full gap-2 flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Lampiran Foto
                                </label>
                                {detailData.photo !== null ? (
                                    <div className="flex justify-between items-center rounded-lg p-4 border border-gray-300 hover:shadow-md transition-shadow bg-gray-50">
                                        <div className="flex flex-row gap-4">
                                            <div className="w-20 h-20 bg-(--color-secondary) rounded-lg items-center justify-center relative">
                                                <Image
                                                    src={getFileIcon(detailData.photo)}
                                                    fill
                                                    alt="Format"
                                                    className="object-cover p-4"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center gap-1">
                                                <p className="text-md font-bold">Bukti Absensi</p>
                                                <span
                                                    onClick={() => handlePreview(detailData.path)}
                                                    className="text-xs cursor-pointer hover:underline text-(--color-muted)"
                                                >
                                                    See File
                                                </span>
                                            </div>
                                        </div>
                                        {previewUrl && (
                                            <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
                                                <div className="bg-white w-3/4 h-3/4 rounded-xl p-4 relative">
                                                    <div className="items-center justify-between flex mb-5">
                                                        <p className="text-md font-bold">Detail Foto</p>
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
                                ) : (
                                    <div className="flex justify-between items-center rounded-lg p-4 border border-gray-300 hover:shadow-md transition-shadow bg-gray-50">
                                        <div className="flex flex-row gap-4">
                                            <div className="w-20 h-20 bg-(--color-secondary) rounded-lg items-center justify-center relative">
                                                <Image
                                                    src={getFileIcon(detailData.photo)}
                                                    fill
                                                    alt="Format"
                                                    className="object-cover p-4"
                                                />
                                            </div>
                                            <div className="text-center text-(--color-muted) py-6">
                                                Belum ada lampiran yang tersedia.
                                            </div>
                                        </div>
                                    </div>  
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 border-t border-(--color-border) pt-6">
                    <h2 className="text-lg font-semibold text-(--color-text-primary) mb-4">
                        Detail Lokasi CheckIn
                    </h2>
                    {detailData.latitude && detailData.longitude ? (
                        <div className="w-full h-84 rounded-lg overflow-hidden border border-(--color-border)">
                            <MapContainer
                                center={[parseFloat(detailData.latitude), parseFloat(detailData.longitude)]}  // Pusatkan ke lokasi check-in
                                zoom={15}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  // Tile layer gratis dari OSM
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker position={[parseFloat(detailData.latitude), parseFloat(detailData.longitude)]}>
                                    <Popup>
                                        Lokasi Check-In: {detailData.address || "Alamat tidak tersedia"}<br />
                                        Koordinat: {detailData.latitude}, {detailData.longitude}
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    ) : (
                        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-(--color-muted)">
                            Lokasi check-in tidak tersedia.
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4 mt-6">
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold text-lg text-(--color-text-primary)">
                            History Absensi
                        </h2>
                    </div>
                    {lastShownHistory.length > 0 ? (
                        lastShownHistory.map((abs: any) => (
                            <div
                                key={abs.checkIn}
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
                                        {abs.user.id} - {abs.checkIn ? format(new Date(abs.checkIn), "dd MMM yyyy") : "-"}
                                    </span>
                                    <span
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg uppercase text-center w-fit 
                                        ${getStatusColor(
                                            abs
                                        )}`}
                                    >
                                        {getCheckInStatus(abs.checkIn)}
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 py-3">
                                    <div className="flex flex-col gap-2">
                                        <div className="text-sm text-gray-500 flex gap-2 items-center justify-left">
                                            <Image
                                                src={icons.dateIn}
                                                alt="Tanggal Mulai Cuti"
                                                width={24}
                                                height={24}
                                            />
                                            {abs.checkIn ? format(new Date(abs.checkIn), "dd MMM yyyy") : "-"}
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-5">
                                            <div className="text-sm text-gray-500 flex gap-2 items-center justify-center">
                                                <Image
                                                    src={icons.clockIn}
                                                    alt="Jam Check In Absensi"
                                                    width={24}
                                                    height={24}
                                                />
                                                {getTimeFromISO(abs.checkIn)}
                                            </div>
                                            <div className="text-sm text-gray-500 flex gap-2 items-center justify-center">
                                                <Image
                                                    src={icons.clockOut}
                                                    alt="Jam Check Out Absensi"
                                                    width={24}
                                                    height={24}
                                                />
                                                {getTimeFromISO(abs.checkOut)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <Link
                                            href={`/dashboard/absensi-karyawan/${abs.user.id}?date=${abs.checkIn}`}
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
                            Belum ada riwayat absensi lainnya.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
