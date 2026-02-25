"use client";

import React from "react";
import { motion } from "framer-motion";
import { useKpi } from "@/app/lib/hooks/kpi/useKpi";
import { IndikatorResponse } from "@/app/lib/types/kpi/kpiTypes";
import { useJawaban } from "@/app/lib/hooks/kpi/useJawaban";

const HasilKKData = () => {
    const { data } = useKpi().fetchAllIndikator({ limit: 1000 });
    const { data: allJawaban } = useJawaban().fetchAllJawaban({ limit: 1000 });

    const indikators = data?.data || [];
    const totalPenilaian = data?.meta?.total || 0;

    const analyzedIndikators = indikators.map((ikk: IndikatorResponse) => {
        const totalEvaluatees = ikk.evaluations?.length || 0;
        const answeredUniqueIds = new Set(
            allJawaban?.data
                ?.filter((j: any) => j.indikatorId === ikk.id)
                .map((j: any) => j.evaluateeId)
        );
        const totalTerjawab = answeredUniqueIds.size;
        const isSelesai = totalEvaluatees > 0 && totalTerjawab === totalEvaluatees;
        return { ...ikk, isSelesai };
    });

    const selesaiCount = analyzedIndikators.filter((p: any) => p.isSelesai).length;
    const belumLengkapCount = analyzedIndikators.length - selesaiCount;

    const stats = [
        { id: 1, label: "Total Indikator", value: totalPenilaian, color: "bg-blue-100 text-blue-700" },
        { id: 3, label: "Total Indikator Selesai", value: selesaiCount, color: "bg-emerald-100 text-emerald-700" },
        { id: 4, label: "Total Indikator Belum Lengkap", value: belumLengkapCount, color: "bg-red-100 text-red-700" },
    ];

    return (
        <div className="relative w-full flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                            Jumlah {item.label}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default HasilKKData;