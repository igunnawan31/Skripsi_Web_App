"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import FilterBar from "@/app/dashboard/dashboardComponents/allComponents/FilterBar";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { IndikatorKPI, KontrakKerja, StatusIndikatorKPI, StatusPublicKPI } from "@/app/lib/types/types";
import { fetchKontrakKerja } from "@/app/lib/hooks/dummyHooks/fetchKontrakKerja";
import { fetchIndikatorKPI } from "@/app/lib/hooks/dummyHooks/fetchIndikatorKPI";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import FilterModal from "@/app/dashboard/dashboardComponents/allComponents/FilterModal";
import { MinorRole } from "@/app/lib/types/enumTypes";

const HasilKKList = () => {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [indikatorKpi, setIndikatorKpi] = useState<IndikatorKPI[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get("statusPublic") || "All");
    const [selectedStatusIndikator, setSelectedStatusIndikator] = useState<string>(searchParams.get("status") || "All");
    const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("searchTerm") || "");
    
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const result = await fetchIndikatorKPI(
            currentPage,
            itemsPerPage,
            selectedStatus,
            selectedStatusIndikator,
        );
        setIndikatorKpi(result.data);
        setTotalItems(result.total);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, itemsPerPage, selectedStatus, selectedStatusIndikator]);

    const handleApplyFilters = (filters: Record<string, string | undefined>) => {
        setSelectedStatus(filters.status || "All");
        setCurrentPage(1);
    };

    const filterFields = [
        { key: "date", label: "Date", type: "date" as const },
        { key: "status", label: "Status Indikator", type: "select" as const, options: Object.values(StatusIndikatorKPI) },
        { key: "statusPublic", label: "Status Publik", type: "select" as const, options: Object.values(StatusPublicKPI) },
    ];

    const initialValues = {
        status: selectedStatusIndikator,
        statusPublic: selectedStatus
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const renderHtml = (
        <div className="flex flex-col gap-4 w-full relative">
            <SearchBar
                placeholder="Cari karyawan..."
                onSearch={handleSearch}
            />
            <div className="flex flex-wrap md:items-center gap-3">
                <div className="flex flex-wrap items-center gap-4">
                    <div
                        onClick={() => setIsFilterOpen((v) => !v)}
                        className="group px-4 py-2 bg-(--color-surface) border border-(--color-border) rounded-lg text-sm font-medium text-(--color-textPrimary) hover:bg-(--color-primary) hover:text-(--color-surface) transition cursor-pointer flex items-center gap-2"
                    >
                        <Image
                            src={icons.filterBlack}
                            alt="Filter Icon"
                            width={16}
                            height={16}
                            className="block group-hover:hidden"
                        />
                        <Image
                            src={icons.filterWhite}
                            alt="Filter Icon"
                            width={16}
                            height={16}
                            className="hidden group-hover:block"
                        />
                        Filter
                    </div>
                </div>
                {(selectedStatus !== "All" || searchQuery) && (
                    <>
                        {searchQuery && (
                            <span
                                className="flex items-center gap-2 bg-(--color-surface) border border-(--color-border) px-4 py-2 rounded-lg text-sm"
                            >
                                Search: {searchQuery}
                                <button
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    onClick={() => setSearchQuery("")}
                                >
                                    ✕
                                </button>
                            </span>
                        )}
                        {selectedStatus !== "All" && (
                            <span
                                className="flex items-center gap-2 bg-(--color-surface) border border-(--color-border) px-4 py-2 rounded-lg text-sm"
                            >
                                Status: {selectedStatus}
                                <button
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    onClick={() => setSelectedStatus("All")}
                                >
                                    ✕
                                </button>
                            </span>
                        )}
                    </>
                )}
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
            ) : indikatorKpi.length > 0 ? (
                <>
                    {indikatorKpi.map((ikk) => (
                        <div
                            key={ikk.id}
                            className="flex flex-col p-4 group bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                        >
                            <div className="flex justify-between items-center text-sm text-(--color-textPrimary) border-b border-(--color-border) py-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">Indikator Kinerja Karyawan</span>
                                    <span className="text-(--color-muted)">{ikk.id}</span>
                                    <p className="text-xs text-(--color-muted)">
                                        {ikk.periodeMulai} s.d {ikk.periodeBerakhir}
                                    </p>
                                </div>
                                <div className="text-blue-900">
                                    {ikk.status}
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <div className="flex flex-col gap-2 items-start">
                                    <p className="font-medium text-(--color-text-primary)">
                                        {ikk.namaIndikator} — {ikk.kategori}
                                    </p>
                                    <p className="text-sm text-(--color-muted)">
                                        Status Public: {ikk.statusPublic}
                                    </p>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <Link
                                        href={`/dashboard/manajemen-kpi/hasil-kinerja-karyawan/${ikk.id}`}
                                        className="flex items-center justify-center gap-2 py-2 px-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer"
                                    >
                                        <Image
                                            src={icons.viewLogo}
                                            alt="View Logo"
                                            width={20}
                                            height={20}
                                        />
                                        See More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <p className="text-center text-gray-500 py-6">
                    Tidak ada data manajemen indikator sesuai filter.
                </p>
            )}

            {indikatorKpi.length > 0 && !loading && (
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
            <FilterModal
                isOpen={isFilterOpen}
                filterFields={filterFields}
                initialValues={initialValues}
                onClose={() => setIsFilterOpen(false)}
                onApply={handleApplyFilters}
            />
        </div>
    );

    return renderHtml;
};

export default HasilKKList;
