"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useAbsensi } from "@/app/lib/hooks/absensi/useAbsensi";
import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns";

const AbsensiData = ({ selectedDate }: { selectedDate: string }) => {
    const today = new Date().toISOString().split("T")[0];

    const { data } = useAbsensi().fetchAllAbsensi({
        date: new Date(`${selectedDate}T00:00:00`).toISOString(),
    });

    const stats = useMemo(() => {
        const list = data?.data || [];
        
        const checkStatus = (checkIn?: string) => {
            if (!checkIn) return "none";
            const zoned = toZonedTime(checkIn, "Asia/Jakarta");
            const limit = new Date(zoned);
            limit.setHours(8, 30, 0, 0);
            return zoned > limit ? "late" : "ontime";
        };

        const totalAbsen = list.length;
        const onTimeCount = list.filter((a: any) => checkStatus(a.checkIn) === "ontime").length;
        const lateCount = list.filter((a: any) => checkStatus(a.checkIn) === "late").length;
        
        const isPastDay = selectedDate < today;
        const invalidCount = isPastDay 
            ? list.filter((a: any) => !a.checkOut || a.checkOut === "-").length 
            : 0;

        return [
            { id: 1, label: "Total Absen", value: totalAbsen, color: "bg-blue-100 text-blue-700" },
            { id: 2, label: "Tepat Waktu", value: onTimeCount, color: "bg-emerald-100 text-emerald-700" },
            { id: 3, label: "Terlambat", value: lateCount, color: "bg-amber-100 text-amber-700" },
            { id: 4, label: "Absensi Tidak Valid", value: invalidCount, color: "bg-red-100 text-red-700", note: "Lupa Checkout" }
        ];
    }, [data, selectedDate, today]);

    return (
        <div className="relative w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((item) => (
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
                        {item.id === 4 && item.value > 0 && (
                            <p className="text-[10px] text-red-500 mt-1 font-medium">⚠️ {item.note} terdeteksi</p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                            Untuk tanggal {format(new Date(selectedDate), "dd MMM yyyy")}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default AbsensiData;