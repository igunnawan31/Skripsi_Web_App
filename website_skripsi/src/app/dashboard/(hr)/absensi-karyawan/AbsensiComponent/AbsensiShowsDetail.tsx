"use client";

import Link from "next/link";
import { useAbsensi } from "@/app/lib/hooks/absensi/useAbsensi";
import { useRouter } from "next/navigation";

export default function AbsensiShowsDetail({ id }: { id: string }) {
    const absensi = useAbsensi();
    const {
        data: detailData,
        isLoading: isDetailLoading,
        error: detailError,
    } = absensi.fetchAbsensiById(id);

    const {
        data: historyData,
        isLoading: isHistoryLoading,
        error: historyError,
    } = absensi.fetchAbsensiByUserId(id);

    if (isDetailLoading || isHistoryLoading) {
        return <div className="text-center text-(--color-muted)">Memuat data...</div>;
    }

    if (detailError || historyError) {
        return <div className="text-center text-red-500">Terjadi kesalahan.</div>;
    }

    if (!detailData) {
        return <div className="text-center text-red-500">Data tidak ditemukan.</div>;
    }
    const router = useRouter();
    const lastShownHistory = historyData?.slice(0,7) ?? []; 

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-(--color-text-primary)">
                    Detail Absensi
                </h1>
                <span className="text-sm text-(--color-muted)">ID: {detailData.id}</span>
            </div>

            <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="w-full md:w-1/2 flex flex-col items-center text-center gap-4">
                        <div className="w-full h-96 bg-(--color-tertiary) flex items-center justify-center text-white text-xl font-semibold rounded-xl">
                            Foto
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-(--color-text-primary)">
                                {/* {data.name} */}
                            </h2>
                            <p className="text-sm text-(--color-text-secondary)">
                                {/* Jabatan: {data.minorRole} */}
                            </p>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 gap-3">
                        <div className="flex flex-col gap-y-2 text-sm items-start justify-start">
                            <p className="text-(--color-muted)">ID Karyawan</p>
                            {/* <p className="font-medium text-(--color-text-primary)">{data.id}</p> */}

                            <p className="text-(--color-muted)">Status Kerja</p>
                            {/* <p className="font-medium text-(--color-text-primary)">{data.workStatus}</p> */}

                            <p className="text-(--color-muted)">Tanggal</p>
                            {/* <p className="font-medium text-(--color-text-primary)">{data.date}</p> */}

                            <p className="text-(--color-muted)">Check In</p>
                            {/* <p className="font-medium text-(--color-success)">{data.checkIn}</p> */}

                            <p className="text-(--color-muted)">Check Out</p>
                            {/* <p className="font-medium text-(--color-error)">{data.checkOut}</p> */}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 mt-6">
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold text-lg text-(--color-text-primary)">
                            History Absensi
                        </h2>
                    </div>

                    {lastShownHistory.length === 0 && (
                        <div className="text-center text-(--color-muted) py-6">
                            Belum ada riwayat absensi.
                        </div>
                    )}
                    {lastShownHistory.length > 0 ? (
                        lastShownHistory.map((abs: any) => (
                            <div
                                key={abs.id}
                                className="flex justify-between items-center rounded-lg p-4 border border-(--color-border) shadow-sm hover:shadow-md transition-shadow bg-white"
                            >
                                <div className="flex flex-col gap-0 items-start">
                                    <p className="font-medium text-(--color-text-primary)">
                                        {abs.date}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <span className="py-3 text-(--color-success)">{abs.checkIn}</span>
                                        - 
                                        <span className="py-3 text-(--color-error)">{abs.checkOut}</span>
                                    </p>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            abs.workStatus === "Work From Home"
                                            ? "bg-green-100 text-green-700"
                                            : abs.workStatus === "Hybrid"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                        {abs.workStatus}
                                    </span>
                                    <Link
                                        href={`/dashboard/absensi-karyawan/${abs.id}`}
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
