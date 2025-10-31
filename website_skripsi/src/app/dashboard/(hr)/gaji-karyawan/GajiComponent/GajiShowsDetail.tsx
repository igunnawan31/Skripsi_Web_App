"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gaji, GajiStatus } from "@/app/lib/types/types";
import { dummyGaji } from "@/app/lib/dummyData/GajiData";

export default function GajiShowsDetail({ id }: { id: string }) {
    const [data, setData] = useState<Gaji | null>(null);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<Gaji[]>([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            const found = dummyGaji.find((item) => item.id === id);
            setData(found || null);
            setLoading(false);

            if (found) {
                const historyData = dummyGaji
                    .filter(
                        (gj) =>
                            gj.name === found.name &&
                            new Date(gj.dueDate) < new Date(found.dueDate)
                    )
                    .slice(0, 10);
                setHistory(historyData);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [id]);

    const handlePembayaran = () => {
        setShowForm(!showForm);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert("Bukti pembayaran berhasil dikirim!");
        setShowForm(false);
    };

    const getStatusColor = (gj: Gaji) => {
        const today = new Date();
        const due = new Date(gj.dueDate);

        if (gj.status === GajiStatus.BELUM_DIBAYAR) 
            return "bg-yellow-100 text-yellow-800";

        if (gj.status === GajiStatus.DIBAYAR) 
            return "bg-green-100 text-green-800";

        if (gj.status === GajiStatus.TERLAMBAT || 
        (gj.status === GajiStatus.BELUM_DIBAYAR && due < today)) 
            return "bg-red-100 text-red-800";

        return "bg-gray-100 text-gray-700";
    };

    const statusClasses: Record<GajiStatus, string> = {
        [GajiStatus.BELUM_DIBAYAR]: "bg-yellow-100 text-yellow-800",
        [GajiStatus.DIBAYAR]: "bg-green-100 text-green-800",
        [GajiStatus.TERLAMBAT]: "bg-red-100 text-red-800",
    };

    if (loading) return <div className="text-center text-(--color-muted)">Memuat data...</div>;
    if (!data) return <div className="text-center text-red-500">Data tidak ditemukan.</div>;

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-(--color-text-primary)">Detail Gaji</h1>
                <span className="text-sm text-(--color-muted)">ID: {data.id}</span>
            </div>

            <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="w-full md:w-1/2 flex flex-col items-center text-center gap-4">
                        <div className="w-full h-96 bg-(--color-tertiary) flex items-center justify-center text-white text-xl font-semibold rounded-xl">
                            Foto
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-(--color-text-primary)">
                                {data.name}
                            </h2>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <div className="flex flex-col gap-y-2 text-sm items-start justify-start">
                            <p className="text-(--color-muted)">Status Cuti</p>
                            <p>{data.status}</p>
                        </div>

                        {(data.status === GajiStatus.BELUM_DIBAYAR || data.status === GajiStatus.TERLAMBAT) ? (
                            <div className="w-full flex gap-3">
                                <button
                                    onClick={handlePembayaran}
                                    className="w-full px-4 py-2 bg-(--color-primary) text-white rounded-lg cursor-pointer"
                                >
                                    {showForm ? "Tutup Form Pembayaran" : "Bayar Tagihan Karyawan"}
                                </button>
                            </div>
                        ) : (
                            <div className="w-full flex gap-3">
                                <button
                                    onClick={handlePembayaran}
                                    className="w-full px-4 py-2 bg-(--color-primary) text-white rounded-lg cursor-pointer"
                                >
                                    {showForm ? "Tutup Form Pembayaran" : "Detail Form Pembayaran"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {showForm && (
                    <div className="mt-6 border-t border-(--color-border) pt-6">
                        <h2 className="text-lg font-semibold text-(--color-text-primary) mb-4">
                            Form Pembayaran
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-(--color-text-secondary)"
                                >
                                    Email Penerima
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full p-2.5 border border-(--color-border) rounded-lg bg-(--color-background) text-(--color-text-primary) focus:ring-2 focus:ring-(--color-primary) focus:outline-none transition-all"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="jumlah"
                                    className="block mb-2 text-sm font-medium text-(--color-text-secondary)"
                                >
                                    Jumlah Pembayaran
                                </label>
                                <div className="w-full border border-(--color-border) p-2.5 rounded-lg text-(--color-text-primary) bg-(--color-background) flex items-center">
                                    <span className="text-gray-600">
                                        Rp
                                    </span>
                                    <input
                                        type="number"
                                        id="jumlah"
                                        className="w-full p-2.5 rounded-lg bg-(--color-background) text-(--color-text-primary) focus:outline-none transition-all"
                                        placeholder="Masukkan nominal..."
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="buktiPembayaran"
                                    className="block mb-2 text-sm font-medium text-(--color-text-secondary)"
                                >
                                    Upload Bukti Pembayaran
                                </label>
                                <div className="w-full border border-(--color-border) p-2.5 rounded-lg text-(--color-text-primary) bg-(--color-background) flex items-center justify-between">
                                    <span className="truncate text-gray-600">
                                        {/* {image ? image.name : product?.image?.[product.image.length - 1]?.filename || "No image selected"} */}
                                        No Image selected
                                    </span>
                                    <input
                                        type="file"
                                        id="buktiPembayaran"
                                        accept="image/*,.pdf"
                                        className="hidden"
                                        required
                                    />
                                    <label
                                        htmlFor="imageUpload"
                                        className="ml-3 py-1 px-3 bg-(--color-primary) text-white rounded-lg cursor-pointer text-md"
                                    >
                                        Upload
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2.5 bg-(--color-primary) text-white font-semibold rounded-lg hover:bg-(--color-primary)/80 transition-all cursor-pointer"
                            >
                                Kirim Pembayaran
                            </button>
                        </form>
                    </div>
                )}

                <div className="flex flex-col gap-4 mt-6">
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold text-lg text-(--color-text-primary)">
                            Riwayat Gaji
                        </h2>
                    </div>

                    {history.length > 0 ? (
                        history.map((gj) => (
                            <div
                                key={gj.id}
                                className="flex justify-between items-center rounded-lg p-4 border border-(--color-border) shadow-sm hover:shadow-md transition-shadow bg-white"
                            >
                                <div className="flex flex-col gap-0 items-start">
                                    <p className="font-medium text-(--color-text-primary)">
                                        {gj.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Tenggat: {gj.dueDate}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Dibayar: {gj.paymentDate ? gj.paymentDate : "-"}
                                    </p>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <span
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg border ${
                                            gj.status === GajiStatus.DIBAYAR
                                            ? "bg-green-100 text-green-800"
                                            : gj.status === GajiStatus.TERLAMBAT
                                            ? "bg-red-100 text-red-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }`}
                                        >
                                        {gj.status}
                                        </span>
                                    <Link
                                        href={`/dashboard/gaji-karyawan/${gj.id}`}
                                        className="flex items-center gap-2 p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer"
                                    >
                                        Detail
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-(--color-muted) py-6">
                            Belum ada riwayat gaji lainnya.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
