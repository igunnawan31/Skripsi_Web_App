"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useCuti } from "@/app/lib/hooks/cuti/useCuti";
import { CutiResponse } from "@/app/lib/types/cuti/cutiTypes";
import { CutiStatus } from "@/app/lib/types/enumTypes";
import { useKpi } from "@/app/lib/hooks/kpi/useKpi";
import { useUser } from "@/app/lib/hooks/user/useUser";
import { useUserLogin } from "@/app/context/UserContext";
import { StatusIndikatorKPI } from "@/app/lib/types/kpi/kpiTypes";
import { useSearchParams } from "next/navigation";

const PenilaianIndikatorData = () => {
    const searchParams = useSearchParams();
    const user = useUserLogin();
    const { data } = useKpi().fetchAllIndikator({});
    const { data: fetchedDataUser } = useUser().fetchAllUser();

    const tasksToReview = React.useMemo(() => {
        if (!data?.data || !user?.id) return [];

        const userMap = new Map();
        if (fetchedDataUser?.data) {
            fetchedDataUser.data.forEach((u: any) => {
                userMap.set(u.id, u.name);
            });
        }

        const allTasks = data.data
            .filter((indikator: any) => indikator.status === StatusIndikatorKPI.ACTIVE)
            .flatMap((indikator: any) => {
                const myEvaluations = indikator.evaluations?.filter(
                    (ev: any) => ev.evaluatorId === user?.id
                ) || [];

                return myEvaluations.map((ev: any) => {
                    const dataRekap = indikator.rekap?.find(
                        (r: any) => r.userId === ev.evaluateeId
                    );
                    const sudahDinilai = (dataRekap?.jumlahPenilai || 0) > 0;
                    
                    return {
                        idUnique: `${indikator.id}-${ev.evaluateeId}`,
                        indikatorId: indikator.id,
                        indikatorPertanyaan: indikator.pertanyaan.length,
                        namaIndikator: indikator.name,
                        description: indikator.description,
                        startDate: indikator.startDate,
                        endDate: indikator.endDate,
                        evaluateeId: ev.evaluateeId,
                        namaTarget: userMap.get(ev.evaluateeId) || ev.evaluatee?.name || "Karyawan",
                        sudahDinilai: sudahDinilai,
                    };
                });
            });

        return allTasks;
    }, [data, user?.id, fetchedDataUser]);

    const stats = useMemo(() => {
        const penilaian = tasksToReview || [];
        const totalPenilaian = penilaian.length;
        
        return [
            { id: 1, label: "Total Karyawan Yang Harus Dinilai", value: totalPenilaian, color: "bg-blue-100 text-blue-700" },
            { id: 3, label: "Total Karyawan Yang Sudah Dinilai", value: penilaian.filter((p: any) => p.sudahDinilai === true).length, color: "bg-emerald-100 text-emerald-700" },
            { id: 4, label: "Total Karyawan Yang Belum Dinilai", value: penilaian.filter((p: any) => p.sudahDinilai === false).length, color: "bg-red-100 text-red-700" },
        ];
    }, [tasksToReview]);

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

export default PenilaianIndikatorData;