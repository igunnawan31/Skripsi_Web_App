"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import FilterBar from "@/app/dashboard/dashboardComponents/allComponents/FilterBar";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchPenilaianKPI } from "@/app/lib/hooks/dummyHooks/fetchPenilaianKPI";

const PenilaianIndikatorList = () => {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [usersToReview, setUsersToReview] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get("statusPublic") || "All");
    const [showButton, setShowButton] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [searchKeyword, setSearchKeywoard] = useState("");
    const router = useRouter();

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const result = await fetchPenilaianKPI(
                currentPage,
                itemsPerPage,
                selectedStatus,
                selectedMonth,
                searchKeyword
            );
            setUsersToReview(result.data);
            setTotalItems(result.total);
            setLoading(false);
            console.log(result);
        };
        load();
    }, [currentPage, itemsPerPage, selectedStatus, selectedMonth, searchKeyword]);

    const getStatusColor = (sudahDinilai: boolean) => {
        if (sudahDinilai) return "bg-green-100 text-green-800";
        return "bg-red-100 text-red-800";
    };

    const renderHtml = (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="w-full flex-col md:flex-row items-center justify-between">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
                            <FilterBar
                                label="Filter by Status Publish:"
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                                options={[
                                    { value: "All", label: "All Status" },
                                    { value: "true", label: "Sudah Dinilai " },
                                    { value: "false", label: "Belum Dinilai" },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: itemsPerPage }).map((_, i) => (
                        <div
                            key={i}
                            className="animate-pulse w-full bg-slate-200 h-48 rounded-xl"
                        ></div>
                    ))}
                </div>
            ) : usersToReview.length > 0 ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {usersToReview.map((ik) => (
                        <Link
                            key={ik.dinilai.id}
                            href={`/dashboard/manajemen-kpi/penilaian-kinerja-karyawan/${ik.dinilai.id}`}
                            className="group bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                        >
                            <div className="p-5 flex flex-col gap-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-(--color-muted) font-medium truncate">
                                        {ik.dinilai.nama}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1 mt-2">
                                    <h2 className="font-semibold text-lg">-</h2>
                                    <p className="text-sm">
                                        <span className="font-medium">{ik.periodeMulai}</span> 
                                        {ik.periodeMulai} — {ik.periodeBerakhir} 
                                        <span className="font-medium">{ik.periodeBerakhir}</span>
                                    </p>
                                    <p>
                                        {}
                                    </p>
                                    <span
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg border ${getStatusColor(
                                            ik
                                        )}`}
                                    >
                                        {ik.sudahDinilai}
                                    </span>
                                </div>

                                {/* {showButton && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onButtonClick?.(ik.id);
                                            router.push(`/dashboard/gaji-karyawan/${ik.id}`);
                                        }}
                                        className="mt-3 w-full py-2 rounded-lg text-sm font-semibold bg-(--color-primary) text-white hover:bg-(--color-tertiary) hover:text-(--color-secondary) transition cursor-pointer"
                                    >
                                        {(ik.status === jawabanKPIStatus.BELUM_DIISI) ? (
                                            <p>{buttonText}</p>
                                        ): (
                                            <p>Detail Gaji Karyawan</p>
                                        )}
                                    </button>
                                )} */}
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-6">
                    Tidak ada data cuti sesuai filter.
                </p>
            )}

            {usersToReview.length > 0 && !loading && (
                <div className="mt-6">
                    <PaginationBar
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={(page) => setCurrentPage(page)}
                        onItemsPerPageChange={(num) => setItemsPerPage(num)}
                    />
                </div>
            )}
        </div>
    );

    return renderHtml;
};

export default PenilaianIndikatorList;
