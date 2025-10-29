"use client";

import { useEffect, useState } from "react";
import { dummyCuti } from "@/app/lib/dummyData/CutiData";
import { Cuti } from "@/app/lib/types/types";
import Link from "next/link";

export default function CutiShowsDetail({ id }: { id: string }) {
    const [data, setData] = useState<Cuti | null>(null);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<Cuti[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const found = dummyCuti.find((item) => item.id === id);
            setData(found || null);
            setLoading(false);

            if (found) {
                const historyData = dummyCuti
                    .filter((ct) => 
                        ct.name === found.name && 
                        ct.submissionDate < found.submissionDate
                    )
                    .slice(0,10);
                setHistory(historyData);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [id]);

    const handleApprove = () => {
        if (!data) return;
        setData({ ...data, status: "Diterima"})
    };

    const handleReject = () => {
        if (!data) return;
        setData({ ...data, status: "Ditolak"})
    };

    const handleChangeDecision = () => {
        if (!data) return;
        setData({ ...data, status: "Menunggu"})
    };

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
                    Detail Cuti
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

                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <div className="flex flex-col gap-y-2 text-sm items-start justify-start">
                            <p className="text-(--color-muted)">Cabang</p>
                            <p className="font-medium text-(--color-text-primary)">{data.branch}</p>

                            <p className="text-(--color-muted)">Status Cuti</p>
                            <p
                                className={`font-medium ${
                                    data.status === "Diterima"
                                    ? "text-green-600"
                                    : data.status === "Ditolak"
                                    ? "text-red-600"
                                    : "text-yellow-600"
                                }`}
                            >
                                {data.status}
                            </p>

                            <p className="text-(--color-muted)">Tanggal Mulai</p>
                            <p className="font-medium text-(--color-success)">
                                {data.startDate}
                            </p>

                            <p className="text-(--color-muted)">Tanggal Selesai</p>
                            <p className="font-medium text-(--color-error)">
                                {data.endDate}
                            </p>

                            <p className="text-(--color-muted)">Alasan</p>
                            <p className="font-medium text-(--color-text-primary)">
                                {data.reason}
                            </p>

                            <p className="text-(--color-muted)">Total Hari</p>
                            <p className="font-medium text-(--color-text-primary)">
                                {data.totalDays} hari
                            </p>
                        </div>
                        <div className="w-full flex gap-3 ">
                            {data.status === "Menunggu" ? (
                                <div className="w-full flex justify-between gap-3">
                                    <button
                                        onClick={handleApprove}
                                        className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                    >
                                        Setujui
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                    >
                                        Tolak
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleChangeDecision}
                                    className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                                >
                                    Ubah Keputusan
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 mt-6">
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold text-lg text-(--color-text-primary)">
                            Riwayat Cuti
                        </h2>
                    </div>
                    {history.length > 0 ? (
                        history.map((ct) => (
                            <div
                                key={ct.id}
                                className="flex justify-between items-center rounded-lg p-4 border border-(--color-border) shadow-sm hover:shadow-md transition-shadow bg-white"
                            >
                                <div className="flex flex-col gap-0 items-start">
                                    <p className="font-medium text-(--color-text-primary)">
                                        {ct.reason}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {ct.totalDays} hari
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {ct.startDate} s.d {ct.endDate}
                                    </p>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            ct.status === "Diterima"
                                            ? "bg-green-100 text-green-700"
                                            : ct.status === "Ditolak"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                        {ct.status}
                                    </span>
                                    <Link
                                        href={`/dashboard/cuti-karyawan/${ct.id}`}
                                        className="flex items-center gap-2 p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer"
                                    />
                                    
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
        </div>
    );
}
