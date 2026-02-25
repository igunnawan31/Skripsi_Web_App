"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { eachDayOfInterval, endOfMonth, format, isWeekend, startOfMonth } from "date-fns";
import Image from "next/image";
import { icons, logo } from "@/app/lib/assets/assets";
import Link from "next/link";
import { toZonedTime } from "date-fns-tz";
import { useUser } from "@/app/lib/hooks/user/useUser";
import { useKontrak } from "@/app/lib/hooks/kontrak/useKontrak";
import { useQueries } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import RekapAbsensiShowSkeletonDetail from "./RekapAbsensiShowsSkeletonDetail";

export default function RekapitulasiAbsensiShowsDetail({ id }: { id: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [seeFull, setSeeFull] = useState(false); 

    const today = new Date();
    const defaultMonth = format(today, "yyyy-MM");
    const selectedMonth = searchParams.get("month") || defaultMonth;

    const { data: userData, isLoading: isLoadingUser, error: isErrorUser } = useUser().fetchUserById(id);

    const getWorkingDaysInMonth = (monthString: string) => {
        const [year, month] = monthString.split("-").map(Number);
        const start = startOfMonth(new Date(year, month - 1));
        const end = endOfMonth(new Date(year, month - 1));
        
        const allDays = eachDayOfInterval({ start, end });
        return allDays.filter(day => !isWeekend(day));
    };

    const getCheckInStatus = (checkIn?: string, checkOut?: string, recordDate?: string) => {
        if (!checkIn) return "Tidak Absen";

        const today = new Date().toISOString().split("T")[0];
        const zonedCheckIn = toZonedTime(checkIn, "Asia/Jakarta");
        
        const dateToCheck = recordDate || checkIn.split("T")[0];
        const isPastDay = dateToCheck < today;

        const hasNoCheckOut = !checkOut || checkOut === "" || checkOut === "-";
        if (isPastDay && hasNoCheckOut) {
            return "Tidak Valid";
        }

        const limit = new Date(zonedCheckIn);
        limit.setHours(8, 30, 0, 0);

        return zonedCheckIn > limit ? "Terlambat" : "Tepat Waktu";
    };

    const toWIB = (dateString?: string) => {
        if (!dateString) return "-";
        try {
            const zoned = toZonedTime(dateString, "Asia/Jakarta");
            return format(zoned, "HH:mm");
        } catch (e) {
            return "-";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Tepat Waktu": return "bg-green-100 text-green-800";
            case "Terlambat": return "bg-amber-100 text-amber-800";
            case "Tidak Valid": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const workingDays = getWorkingDaysInMonth(selectedMonth);

    const attendanceQueries = useQueries({
        queries: workingDays.map(day => {
            const dateStr = format(day, "yyyy-MM-dd");
            return {
                queryKey: ["absens-user", id, { date: new Date(`${dateStr}T00:00:00`).toISOString() }],
                queryFn: async () => {
                    const token = Cookies.get("accessToken");
                    if (!token) throw new Error("No access token found");

                    const queryParams = new URLSearchParams();
                    queryParams.append("date", new Date(`${dateStr}T00:00:00`).toISOString());
                    queryParams.append("limit", "1000");

                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/absensi?${queryParams.toString()}`, {
                        method: "GET",
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        credentials: "include",
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.message || "Failed to fetch absensi");
                    }

                    return response.json();
                },
                staleTime: 5 * 60 * 1000,
            };
        }),
    });

    const isLoadingAttendance = attendanceQueries.some(q => q.isLoading);
    const attendanceData = workingDays.map((day, index) => {
        const dateStr = format(day, "yyyy-MM-dd");
        const query = attendanceQueries[index];
        const allAttendanceForDay = query.data?.data || [];        
        const absenData = allAttendanceForDay.find((a: any) => a.user?.id === id || a.userId === id);

        return {
            date: dateStr,
            dayName: format(day, "EEEE"),
            checkIn: absenData?.checkIn || null,
            checkOut: absenData?.checkOut || null,
            status: absenData ? getCheckInStatus(absenData.checkIn, absenData.checkOut, dateStr) : "Tidak Absen",
        };
    });

    const totalWorkingDays = workingDays.length;
    const hadir = attendanceData.filter(a => a.checkIn !== null).length;
    const attendancePercentage = totalWorkingDays > 0 ? ((hadir / totalWorkingDays) * 100).toFixed(1) : 0;

    const stats = useMemo(() => {
        const tepatWaktu = attendanceData.filter(a => a.status === "Tepat Waktu").length;
        const terlambat = attendanceData.filter(a => a.status === "Terlambat").length;
        const tidakValid = attendanceData.filter(a => a.status === "Tidak Valid").length;
        const tidakAbsen = attendanceData.filter(a => a.status === "Tidak Absen").length;

        return [
            { id: 1, label: "Total Absen Per Bulan", value: totalWorkingDays, color: "bg-blue-100 text-blue-700", percentage: `${attendancePercentage}%`  },
            { id: 2, label: "Total Hadir", value: hadir, color: "bg-emerald-100 text-emerald-700", percentage: `${attendancePercentage}%` },
            { id: 3, label: "Tepat Waktu", value: tepatWaktu, color: "bg-amber-100 text-amber-700" },
            { id: 4, label: "Terlambat", value: terlambat, color: "bg-red-100 text-red-700" },
            { id: 5, label: "Tidak Valid", value: tidakValid, color: "bg-gray-100 text-gray-700" },
            { id: 6, label: "Tidak Absen", value: tidakAbsen, color: "bg-gray-100 text-gray-700" },
        ]
    }, [attendanceData, totalWorkingDays, hadir, attendancePercentage]);

    const hasMore = stats.length > 4;
    const displayedStats = (seeFull || !hasMore) ? stats : stats.slice(0, 4);

    if (isLoadingUser || isLoadingAttendance) {
        return (
            <RekapAbsensiShowSkeletonDetail />
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
                        Rekapitulasi Absensi - {userData?.name}
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
                        {item.percentage && (
                            <p className="text-sm font-semibold text-slate-600 mt-1">
                                {item.percentage}
                            </p>
                        )}
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
                                    Check In
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-normal text-gray-600 camelCase">
                                    Check Out
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
                            {attendanceData.map((record, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {format(new Date(record.date), "dd MMM yyyy")}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {record.dayName}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                                        {toWIB(record.checkIn)}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                                        {toWIB(record.checkOut)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-lg uppercase ${getStatusColor(
                                                record.status
                                            )}`}
                                        >
                                            {record.status}
                                        </span>
                                    </td>
                                    {record.checkIn && (
                                        <td className="px-6 py-4 text-center">
                                            <Link
                                                href={`/dashboard/absensi-karyawan/${id}?date=${record.checkIn}`}
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
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
