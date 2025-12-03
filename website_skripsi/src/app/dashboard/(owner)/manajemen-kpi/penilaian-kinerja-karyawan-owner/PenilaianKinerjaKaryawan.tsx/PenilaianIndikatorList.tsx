"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import FilterBar from "@/app/dashboard/dashboardComponents/allComponents/FilterBar";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchPenilaianKPI } from "@/app/lib/hooks/dummyHooks/fetchPenilaianKPI";
import { PenilaianProps } from "@/app/props/HRProps/PenilaianProps";

const PenilaianIndikatorList: React.FC<PenilaianProps> = ({
    buttonText = "Isi Penilaian Karyawan",
    onButtonClick,
}) => {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [usersToReview, setUsersToReview] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get("statusPublic") || "All");
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
                            <div
                                className={`flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto`}
                            >
                                <label className="text-sm font-medium text-(--color-text-secondary)">
                                    Select Month
                                </label>
                                <input
                                    type="month"
                                    value={selectedMonth.toISOString().slice(0, 7)}
                                    onChange={(e) => setSelectedMonth(new Date(e.target.value + "-01"))}
                                    className="border border-(--color-border) rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                                />
                            </div>
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
                                    <span className="px-3 py-1 text-xs rounded-lg border border-(--color-border) bg-(--color-background) text-(--color-text-primary)">
                                        {ik.sudahDinilai ? (
                                            <p>Sudah Dinilai</p>
                                        ) : (
                                            <p>Belum Dinilai</p>
                                        )}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1 mt-2">
                                    <h2 className="font-semibold text-lg">{ik.indikatorKPIBerlaku[0].nama}</h2>
                                    <p className="text-sm text-(--color-muted)">
                                        {ik.indikatorKPIBerlaku[0].description}
                                    </p>
                                    <p className="text-sm text-(--color-text-secondary)">
                                        Date:{" "}
                                        <span className="font-medium text-(--color-text-primary)">
                                            {ik.indikatorKPIBerlaku[0].periodeMulai || "-"} s.d {ik.indikatorKPIBerlaku[0].periodeBerakhir}
                                        </span>
                                    </p>
                                </div>

                                {(
                                    <button
                                        className="mt-3 w-full py-2 rounded-lg text-sm font-semibold bg-(--color-primary) text-white hover:bg-(--color-tertiary) hover:text-(--color-secondary) transition cursor-pointer"
                                    >
                                        {ik.sudahDinilai ? (
                                            <p>Detail Penilaian Karyawan</p>
                                        ) : (
                                            <p>{buttonText}</p>
                                        )}
                                    </button>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-6">
                    Tidak ada data penilaian sesuai filter.
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
