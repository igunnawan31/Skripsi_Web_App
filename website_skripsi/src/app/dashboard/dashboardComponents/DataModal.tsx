"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { useAbsenseData } from "./chartComponents/AttendanceChart";
import { useCutiData } from "./chartComponents/CutiChart";
import { useIndikatorData } from "./chartComponents/IndikatorChart";
import { useGajiData } from "./chartComponents/GajiChart";

type DataModalProps = {
    dataType?: any;
    title: string;
    description: string;
}

const DataModal = ({ title, description }: DataModalProps) => {
    const today = new Date();
    const defaultMonth = format(today, "MMMM yyyy");

    const { attendanceQueries, isLoadingAttendance } = useAbsenseData();
    const { cutiData, isLoadingCuti } = useCutiData();
    const { indikatorData, isLoadingIndikator } = useIndikatorData();
    const { gajiData, isLoadingGaji } = useGajiData();

    const totalAttendance = attendanceQueries.flatMap(q => q.data?.data || []).filter(att => att.checkIn).length;
    const totalCuti = cutiData?.data?.length ?? 0;
    const totalIndikator = indikatorData?.data?.length ?? 0;
    const totalGaji = gajiData?.data?.length ?? 0;

    const DATA_TYPES = [
        { id: 1, label: "Absensi", value: totalAttendance, color: "bg-blue-100 text-blue-600", isLoading: isLoadingAttendance },
        { id: 2, label: "Cuti", value: totalCuti, color: "bg-yellow-100 text-yellow-600", isLoading: isLoadingCuti },
        { id: 3, label: "Indikator", value: totalIndikator, color: "bg-green-100 text-green-600", isLoading: isLoadingIndikator },
        { id: 4, label: "Gaji", value: totalGaji, color: "bg-purple-100 text-purple-600", isLoading: isLoadingGaji },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-all relative">
            <div className="flex flex-col border-b border-(--color-border) pb-4 pt-2 mb-4">
                <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>
                <p className="text-sm font-light text-(--color-muted)">{description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {DATA_TYPES.map((item) => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-all relative flex flex-col gap-2"
                    >
                        <div className="flex justify-between">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.color}`}>
                                {item.label}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {item.isLoading ? (
                                <div className="h-10 w-16 bg-slate-200 animate-pulse rounded-md" />
                            ) : (
                                <h3 className="text-4xl font-bold text-slate-800">{item.value}</h3>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Data HRIS {item.label} Bulan {defaultMonth}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default DataModal;