"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { eachDayOfInterval, endOfMonth, format, isWeekend, parseISO, startOfMonth } from "date-fns";
import Image from "next/image";
import { icons, logo } from "@/app/lib/assets/assets";
import Link from "next/link";
import { toZonedTime } from "date-fns-tz";
import { useUser } from "@/app/lib/hooks/user/useUser";
import { useKontrak } from "@/app/lib/hooks/kontrak/useKontrak";
import { useQueries } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import RekapAbsensiShowSkeletonDetail from "./RekapCutiShowsSkeletonDetail";
import { CutiStatus } from "@/app/lib/types/enumTypes";
import { useCuti } from "@/app/lib/hooks/cuti/useCuti";
import RekapCutiShowSkeletonDetail from "./RekapCutiShowsSkeletonDetail";

export default function RekapitulasiCutiShowsDetail({ id }: { id: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [seeFull, setSeeFull] = useState(false); 

    const today = new Date();
    const defaultMonth = format(today, "yyyy-MM");
    const selectedMonth = searchParams.get("month") || defaultMonth;

    const { data: userData, isLoading: isLoadingUser, error: isErrorUser } = useUser().fetchUserById(id);
    const { data: cutiData, isLoading: isLoadingCuti, error: errorCuti } = useCuti().fetchCutiByUserId(id);

    const processedCuti = useMemo(() => {
        if (!cutiData?.data) return [];
        
        const monthDate = new Date(selectedMonth + "-01");
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);

        return cutiData.data.filter((item: any) => {
            const start = parseISO(item.startDate);
            const end = parseISO(item.endDate);
            return (start <= monthEnd && end >= monthStart);
        });
    }, [cutiData, selectedMonth]);

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

    const stats = useMemo(() => {
        const total = processedCuti.length;
        const getCount = (status: CutiStatus) => processedCuti.filter((c: any) => c.status === status).length;

        return [
            { id: 1, label: "Total Pengajuan Cuti", value: total, color: "bg-blue-100 text-blue-700" },
            { id: 2, label: "Status Cuti Menunggu", value: getCount(CutiStatus.MENUNGGU), color: "bg-amber-100 text-amber-700" },
            { id: 3, label: "Status Cuti Disetujui", value: getCount(CutiStatus.DITERIMA), color: "bg-emerald-100 text-emerald-700" },
            { id: 4, label: "Status Cuti Ditolak", value: getCount(CutiStatus.DITOLAK), color: "bg-red-100 text-red-700" },
            { id: 5, label: "Status Cuti Dibatalkan", value: getCount(CutiStatus.BATAL), color: "bg-gray-100 text-gray-700" },
            { id: 6, label: "Status Cuti Expired", value: getCount(CutiStatus.EXPIRED), color: "bg-gray-100 text-gray-700" }
        ];
    }, [processedCuti]);

    const hasMore = stats.length > 4;
    const displayedStats = (seeFull || !hasMore) ? stats : stats.slice(0, 4);

    if (isLoadingUser || isLoadingCuti) {
        return (
            <RekapCutiShowSkeletonDetail />
        );
    }

    if (isErrorUser) {
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
                                {isErrorUser.message ? isErrorUser.message : "Terdapat kendala pada sistem"}
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
                <div>
                    <h1 className="text-2xl font-bold text-(--color-text-primary)">
                        Rekapitulasi Cuti - {userData?.name}
                    </h1>
                    <p className="text-sm text-(--color-muted) mt-1">
                        Periode: {format(new Date(selectedMonth + "-01"), "MMMM yyyy")}
                    </p>
                </div>
            </div>
            
            <div className="flex justify-between items-center">
                {hasMore && (
                    <button
                        onClick={() => setSeeFull(!seeFull)}
                        className="w-fit px-3 py-2 bg-(--color-primary) hover:bg-red-800 flex flex-row gap-3 rounded-lg cursor-pointer transition"
                    >
                        <p className="text-(--color-surface) text-sm">
                            {seeFull ? "Lihat Lebih Sedikit" : "Lihat Selengkapnya"}
                        </p>
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayedStats.map((item) => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all relative"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${item.color}`}>
                                {item.label}
                            </span>
                        </div>
                        <h3 className="text-4xl font-bold text-slate-800">
                            {item.value}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Jumlah {item.label}
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="w-full bg-(--color-surface) rounded-2xl shadow-md border border-(--color-border) overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-(--color-border)">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-normal text-gray-600 camelCase">
                                    Tanggal
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-normal text-gray-600 camelCase">
                                    Hari
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-normal text-gray-600 camelCase">
                                    Jumlah Hari
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-normal text-gray-600 camelCase">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-normal text-gray-600 camelCase">
                                    Lihat Detail
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-(--color-border)">
                            {processedCuti.map((record: any) => {
                                const sDate = record.startDate ? new Date(record.startDate) : null;
                                const eDate = record.endDate ? new Date(record.endDate) : null;
                                return (
                                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {sDate && eDate 
                                                ? `${format(sDate, "dd MMM")} - ${format(eDate, "dd MMM yyyy")}`
                                                : "Tanggal tidak valid"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {sDate ? format(sDate, "eeee") : "-"}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-900">
                                            {computeTotalDays(record.startDate, record.endDate)} Hari
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`px-3 py-1 text-xs font-semibold rounded-lg uppercase ${getStatusColor(
                                                    record
                                                )}`}
                                            >
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Link
                                                href={`/dashboard/cuti-karyawan/${record.id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition cursor-pointer"
                                            >
                                                <Image
                                                    src={icons.viewLogo}
                                                    alt="View"
                                                    width={16}
                                                    height={16}
                                                />
                                                See More
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
