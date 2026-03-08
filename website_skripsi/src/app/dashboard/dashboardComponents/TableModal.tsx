"use client";

import { useMemo, useState } from "react";
import { AttendanceChart, useAbsenseData } from "./chartComponents/AttendanceChart";
import { CutiChart, useCutiData } from "./chartComponents/CutiChart";
import { format } from "date-fns";
import { IndikatorChart, useIndikatorData } from "./chartComponents/IndikatorChart";
import { IndikatorResponse } from "@/app/lib/types/kpi/kpiTypes";
import { GajiChart, useGajiData } from "./chartComponents/GajiChart";

const DATA_TYPES = [
    { id: 1, label: "Absensi", description: "Monitoring kehadiran harian" },
    { id: 2, label: "Cuti", description: "Pengajuan dan status cuti" },
    { id: 3, label: "Indikator", description: "Status Aktif Indikator Kinerja Karyawan" },
    { id: 4, label: "Gaji", description: "Status Gaji karyawan" },
];

const TableModal = () => {
    const [selected, setSelected] = useState(DATA_TYPES[0]);;
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const { attendanceQueries, workingDaysInMonth: workingAttendance, isLoadingAttendance, checkStatus } = useAbsenseData();
    const { dailyCutiStats, workingDaysInMonth: workingCuti, isLoadingCuti, cutiData } = useCutiData();
    const { indikatorStats, workingDaysInMonth: workingIndikator, isLoadingIndikator, indikatorData } = useIndikatorData();
    const { gajiStats, workingDaysInMonth: workingGaji, isLoadingGaji, gajiData } = useGajiData();

    const handleSelect = (item: typeof DATA_TYPES[0]) => {
        setSelected(item);
        setDropdownOpen(false);
    };

    const activeTableData = useMemo(() => {
        const label = selected.label;

        if (label === "Absensi") {
            const allAttendance = attendanceQueries
                .flatMap(q => q.data?.data || [])
                .filter(att => att.checkIn)
                .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());

            return {
                columns: ["Nama", "Waktu", "Status"],
                rows: allAttendance.slice(0, 6).map(att => ({
                    "Nama": att.user?.name || "N/A",
                    "Waktu": format(new Date(att.checkIn), "HH:mm"),
                    "Status": checkStatus(att.checkIn),
                }))
            };
        }

        if (label === "Cuti") {
            const allCuti = (cutiData?.data || [])
                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            return {
                columns: ["Nama", "Tanggal", "Status"],
                rows: allCuti.slice(0, 6).map((c: any) => ({
                    "Nama": c.user?.name || "N/A",
                    "Tanggal": format(new Date(c.startDate), "dd MMM"),
                    "Status": c.status
                }))
            };
        }

        if (label === "Indikator") {
            return {
                columns: ["Nama", "Status", "Mulai", "Berakhir"],
                rows: (indikatorData?.data || []).slice(0, 6).map((k: IndikatorResponse) => (
                    console.log("status", k.status),
                    {
                    "Nama": k.name,
                    "Status": k.status,
                    "Mulai": format(new Date(k.startDate), "dd/MM/yyyy"),
                    "Berakhir": format(new Date(k.endDate), "dd/MM/yyyy")
                }))
            };
        }

        if (label === "Gaji") {
            return {
                columns: ["Nama", "Status", "Due Date"],
                rows: (gajiData?.data || []).slice(0, 6).map((k: any) => ({
                    "Nama": k.user?.name ,
                    "Status": k.status,
                    "Due Date": format(new Date(k.dueDate), "dd/MM/yyyy")
                }))
            };
        }

        return { columns: [], rows: [] };
    }, [selected, attendanceQueries]);

    const isLoadingTable = 
        selected.label === "Absensi" ? isLoadingAttendance :
        selected.label === "Cuti" ? isLoadingCuti :
        selected.label === "Indikator" ? isLoadingIndikator :
        selected.label === "Gaji" ? isLoadingGaji : false;

    const renderHtml = (
        <div className="w-full flex gap-4">
            <section className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200 w-3/4">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">
                        {selected.label === "Absensi" ? "Tren Absensi Bulanan" : "Statistik Cuti Karyawan"}
                    </h2>
                    <p className="text-sm text-slate-500">
                        {selected.label === "Absensi" 
                            ? "Jumlah karyawan hadir per hari kerja" 
                            : "Status permohonan cuti bulan ini"}
                    </p>
                </div>
                
                {selected.label === "Absensi" && (
                    <AttendanceChart 
                        attendanceQueries={attendanceQueries} 
                        workingDays={workingAttendance}
                        isLoading={isLoadingAttendance} 
                    />
                )}

                {selected.label === "Cuti" && (
                    <CutiChart 
                        dailyCutiStats={dailyCutiStats}
                        workingDays={workingCuti}
                        isLoading={isLoadingCuti} 
                    />
                )}

                {selected.label === "Indikator" && (
                    <IndikatorChart 
                        indikatorStats={indikatorStats}
                        workingDays={workingIndikator}
                        isLoading={isLoadingIndikator} 
                    />
                )}
                {selected.label === "Gaji" && (
                    <GajiChart
                        gajiStats={gajiStats}
                        workingDays={workingGaji}
                        isLoading={isLoadingGaji} 
                    />
                )}
            </section>
            <section className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200 w-1/4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">{selected.label}</h2>
                        <p className="text-xs text-slate-500 line-clamp-2">
                            Menampilkan data terkait kategori {selected.label.toLowerCase()}.
                        </p>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 border border-slate-300 px-3 py-1.5 rounded-lg text-sm hover:bg-slate-100 cursor-pointer"
                        >
                            Pilih Data
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-10">
                                {DATA_TYPES.map((item) => (
                                    <label
                                        key={item.id}
                                        className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-slate-50 text-sm cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="dataOption"
                                            checked={selected.id === item.id}
                                            onChange={() => handleSelect(item)}
                                        />
                                        {item.label}
                                    </label>
                                ))}
                            </div>
                        )}  
                    </div>
                </div>

                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr>
                            {activeTableData.columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className="border-b border-slate-200 px-4 py-2 text-left text-sm font-medium text-slate-600"
                                >
                                    {col}
                                </th>
                            ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingTable ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <tr key={idx}>
                                        {activeTableData.columns.map((_, cIdx) => (
                                            <td key={cIdx} className="px-4 py-2">
                                                <div className="h-4 bg-slate-200 animate-pulse rounded-md" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : activeTableData.rows.length === 0 ? (
                                <tr>
                                    <td colSpan={activeTableData.columns.length} className="px-4 py-6 text-center text-sm text-slate-400">
                                        Tidak ada data tersedia.
                                    </td>
                                </tr>
                            ) : (
                                activeTableData.rows.slice(0, 5).map((row: any, idx: any) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        {activeTableData.columns.map((col, cIdx) => (
                                            <td key={cIdx} className="border-b border-slate-100 px-4 py-2 text-sm text-slate-700">
                                                {(row as Record<string, any>)[col] ?? "-"}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );

    return renderHtml;
};

export default TableModal;