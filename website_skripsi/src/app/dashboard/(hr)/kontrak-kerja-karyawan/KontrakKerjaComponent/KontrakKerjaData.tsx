"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useKontrak } from "@/app/lib/hooks/kontrak/useKontrak";
import { KontrakResponse } from "@/app/lib/types/kontrak/kontrakTypes";
import { KontrakKerjaStatus } from "@/app/lib/types/enumTypes";

const KontrakKerjaData = () => {
    const { data } = useKontrak().fetchAllKontrak({ limit: 1000 });

    const stats = useMemo(() => {
        const kontraks: KontrakResponse[] = data?.data || [];
        const totalCuti = data?.meta.total || 0;
        
        return [
            { id: 1, label: "Total Kontrak", value: totalCuti, color: "bg-blue-100 text-blue-700" },
            { id: 2, label: "Kontrak Aktif", value: kontraks.filter(p => p.status === KontrakKerjaStatus.ACTIVE).length, color: "bg-amber-100 text-amber-700" },
            { id: 3, label: "Kontrak Selesai", value: kontraks.filter(p => p.status === KontrakKerjaStatus.COMPLETED).length, color: "bg-emerald-100 text-emerald-700" },
            { id: 4, label: "Kontrak On-Hold", value: kontraks.filter(p => p.status === KontrakKerjaStatus.ON_HOLD).length, color: "bg-red-100 text-red-700" },
        ];
    }, [data]);

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
                        <p className="text-xs text-slate-500 mt-1">
                            Jumlah Seluruh {item.label}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default KontrakKerjaData;