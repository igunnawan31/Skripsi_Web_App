"use client";

import { useEffect, useState } from "react";
import { dummyAbsensi } from "@/app/lib/dummyData/AbsensiData";
import { Absensi } from "@/app/lib/types/types";

export default function AbsensiShowsDetail({ id }: { id: string }) {
    const [data, setData] = useState<Absensi | null>(null);
    const [loading, setLoading] = useState(true);
    const [historyFilter, setHistoryFilter] = useState("1w");
    const [history, setHistory] = useState<Absensi[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const found = dummyAbsensi.find((item) => item.id === id);
            setData(found || null);
            setLoading(false);

            const historyData = dummyAbsensi
                .filter((ct) => ct.name === found?.name && ct.id !== found?.id)
                .slice(0, 10);
            setHistory(historyData);
        }, 400);

        return () => clearTimeout(timer);
    }, [id]);

    if (loading) {
        return <div className="text-center text-(--color-muted)">Memuat data...</div>;
    }

    if (!data) {
        return <div className="text-center text-red-500">Data tidak ditemukan.</div>;
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-(--color-text-primary)">
                    Detail Absensi
                </h1>
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
                            <p className="text-sm text-(--color-text-secondary)">
                                Jabatan: {data.minorRole}
                            </p>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 gap-3">
                        <div className="flex flex-col gap-y-2 text-sm items-start justify-start">
                            <p className="text-(--color-muted)">ID Karyawan</p>
                            <p className="font-medium text-(--color-text-primary)">{data.id}</p>

                            <p className="text-(--color-muted)">Status Kerja</p>
                            <p className="font-medium text-(--color-text-primary)">{data.workStatus}</p>

                            <p className="text-(--color-muted)">Tanggal</p>
                            <p className="font-medium text-(--color-text-primary)">{data.date}</p>

                            <p className="text-(--color-muted)">Check In</p>
                            <p className="font-medium text-(--color-success)">{data.checkIn}</p>

                            <p className="text-(--color-muted)">Check Out</p>
                            <p className="font-medium text-(--color-error)">{data.checkOut}</p>
                        </div>
                    </div>
                </div>

                {/* === History Section === */}
                <div className="flex flex-col gap-4 mt-6">
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold text-lg text-(--color-text-primary)">
                            History Absensi
                        </h2>
                        <select
                            value={historyFilter}
                            onChange={(e) => setHistoryFilter(e.target.value)}
                            className="text-sm border border-slate-300 rounded-md px-2 py-1 bg-white focus:outline-none"
                        >
                            <option value="1w">1 Week</option>
                            <option value="1m">1 Month</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-(--color-border)">
                        <table className="min-w-full text-sm">
                            <thead className="bg-(--color-tertiary) text-white text-left">
                                <tr>
                                    <th className="py-3 px-4 rounded-tl-xl">Tanggal</th>
                                    <th className="py-3 px-4">Check In</th>
                                    <th className="py-3 px-4">Check Out</th>
                                    <th className="py-3 px-4 rounded-tr-xl">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item, index) => (
                                    <tr
                                        key={index}
                                        className={`border-b border-(--color-border) hover:bg-(--color-background) transition-colors ${
                                            index % 2 === 0 ? "bg-white" : "bg-(--color-background)"
                                        }`}
                                    >
                                        <td className="py-3 px-4 font-medium">{item.date}</td>
                                        <td className="py-3 px-4 text-(--color-success)">
                                            {item.checkIn}
                                        </td>
                                        <td className="py-3 px-4 text-(--color-error)">
                                            {item.checkOut}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    item.workStatus === "Work From Home"
                                                        ? "bg-green-100 text-green-700"
                                                        : item.workStatus === "Hybrid"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {item.workStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {history.length === 0 && (
                        <div className="text-center text-(--color-muted) py-6">
                            Belum ada riwayat absensi.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
