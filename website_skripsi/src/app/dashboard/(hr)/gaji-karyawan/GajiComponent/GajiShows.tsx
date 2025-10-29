"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import { useSearchParams, useRouter } from "next/navigation";
import { GajiRequestProps } from "@/app/props/HRProps/GajiProps";
import { Gaji } from "@/app/lib/types/types";
import { fetchGaji } from "@/app/lib/hooks/dummyHooks/fetchGaji";

const GajiShows: React.FC<GajiRequestProps> = ({
    showButton = false,
    buttonText = "Aksi",
    onButtonClick,
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [gaji, setGaji] = useState<Gaji[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState<string>(
        searchParams.get("status") || "All"
    );
    const [selectedBulan, setSelectedBulan] = useState<string>(
        searchParams.get("bulan") || ""
    );

    const fetchData = async () => {
        setLoading(true);
        const result = await fetchGaji(
            currentPage,
            itemsPerPage,
            selectedStatus,
            selectedBulan,
        );
        setGaji(result.data);
        setTotalItems(result.total);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, itemsPerPage, selectedStatus, selectedBulan]);

    const getStatusColor = (gj: Gaji) => {
        if (gj.status === "Belum Dibayar") return "bg-yellow-100 text-yellow-800";
        if (gj.status === "Dibayar") return "bg-green-100 text-green-800";
        const today = new Date();
        const due = new Date(gj.dueDate);
        if (gj.status === "Terlambat" || (gj.status === "Belum Dibayar" && due < today)) {
            return "bg-red-100 text-red-800";
        }
        return "bg-gray-100 text-gray-700";
    };

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedStatus && selectedStatus !== "All") params.set("status", selectedStatus);
        if (selectedBulan) params.set("bulan", selectedBulan);
        router.replace(`?${params.toString()}`);
    }, [selectedStatus, selectedBulan, router]);

    const renderHtml = (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-(--color-text-secondary)">
                                Filter by Bulan:
                            </label>
                        <input
                            type="month"
                            value={selectedBulan}
                            onChange={(e) => {
                                const selectedMonth = e.target.value;
                                setSelectedBulan(selectedMonth);
                                const params = new URLSearchParams(searchParams);
                                if (selectedMonth) params.set("bulan", selectedMonth);
                                else params.delete("bulan");
                                router.replace(`?${params.toString()}`);
                            }}
                            className="border border-(--color-border) rounded-md px-3 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-(--color-text-secondary)">
                            Filter by Status:
                        </label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="border border-(--color-border) rounded-md px-3 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                        >
                            <option value="All">Semua Status</option>
                            <option value="Dibayar">Dibayar</option>
                            <option value="Belum Dibayar">Belum Dibayar</option>
                            <option value="Terlambat">Terlambat</option>
                        </select>
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
            ) : gaji.length > 0 ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gaji.map((gj) => (
                        <Link
                            key={gj.id}
                            href={`/dashboard/gaji-karyawan/${gj.id}`}
                            className="group bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                        >
                            <div className="p-5 flex flex-col gap-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-(--color-muted) font-medium truncate">
                                        {gj.id}
                                    </span>
                                    <span className="px-3 py-1 text-xs rounded-lg border border-(--color-border) bg-(--color-background) text-(--color-text-primary)">
                                        {gj.minorRole}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1 mt-2">
                                    <h2 className="font-semibold text-lg">{gj.name}</h2>
                                    <p className="text-sm text-gray-600">{gj.branch}</p>
                                    <p className="text-sm">
                                        <span className="font-medium">{gj.month}</span> — {" "}
                                        {gj.amount.toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        })}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Tenggat: {gj.dueDate}
                                        
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Dibayar: {gj.paymentDate ? `${gj.paymentDate}` : "-"}
                                    </p>
                                    <span
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg border ${getStatusColor(
                                            gj
                                        )}`}
                                    >
                                        {gj.status}
                                    </span>
                                </div>

                                {showButton && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onButtonClick?.(gj.id);
                                            router.push(`/dashboard/gaji-karyawan/${gj.id}`);
                                        }}
                                        className="mt-3 w-full py-2 rounded-lg text-sm font-semibold bg-(--color-primary) text-white hover:bg-(--color-tertiary) hover:text-(--color-secondary) transition"
                                    >
                                        {(gj.status === "Belum Dibayar" || gj.status === "Terlambat") ? (
                                            <p>{buttonText}</p>
                                        ): (
                                            <p>Detail Gaji Karyawan</p>
                                        )}
                                    </button>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-6">
                    Tidak ada data gaji sesuai filter.
                </p>
            )}

            {gaji.length > 0 && !loading && (
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

export default GajiShows;
