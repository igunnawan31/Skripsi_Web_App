"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useCuti } from "@/app/lib/hooks/cuti/useCuti";
import { CutiResponse } from "@/app/lib/types/cuti/cutiTypes";
import { CutiStatus } from "@/app/lib/types/enumTypes";

const CutiData = () => {
    const { data } = useCuti().fetchAllCuti({ limit: 1000 });
    console.log(data);
    const [seeFull, setSeeFull] = useState(false); 

    const stats = useMemo(() => {
        const cutis: CutiResponse[] = data?.data || [];
        const totalCuti = data?.meta.total;
        
        return [
            { id: 1, label: "Total Pengajuan Cuti", value: totalCuti, color: "bg-blue-100 text-blue-700" },
            { id: 2, label: "Status Cuti Menunggu", value: cutis.filter(p => p.status === CutiStatus.MENUNGGU).length, color: "bg-amber-100 text-amber-700" },
            { id: 3, label: "Status Cuti Disetujui", value: cutis.filter(p => p.status === CutiStatus.DITERIMA).length, color: "bg-emerald-100 text-emerald-700" },
            { id: 4, label: "Status Cuti Ditolak", value: cutis.filter(p => p.status === CutiStatus.DITOLAK).length, color: "bg-red-100 text-red-700" },
            { id: 5, label: "Status Cuti Dibatalkan", value: cutis.filter(p => p.status === CutiStatus.BATAL).length, color: "bg-gray-100 text-gray-700" },
            { id: 6, label: "Status Cuti Expired", value: cutis.filter(p => p.status === CutiStatus.EXPIRED).length, color: "bg-gray-100 text-gray-700" }
        ];
    }, [data]);

    const hasMore = stats.length > 4;
    const displayedStats = (seeFull || !hasMore) ? stats : stats.slice(0, 4);

    return (
        <div className="relative w-full flex flex-col gap-4">
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
        </div>
    );
}

export default CutiData;