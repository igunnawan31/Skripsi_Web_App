"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import { CutiStatus } from "@/app/lib/types/types";
import { useSearchParams, useRouter } from "next/navigation";
import { CutiRequestProps } from "@/app/props/HRProps/cutiProps";
import FilterBar from "@/app/dashboard/dashboardComponents/allComponents/FilterBar";
import { useCuti } from "@/app/lib/hooks/cuti/useCuti";
import FilterModal from "@/app/dashboard/dashboardComponents/allComponents/FilterModal";
import { format, min, parseISO } from "date-fns";
import { icons } from "@/app/lib/assets/assets";
import Image from "next/image";

const CutiShows: React.FC<CutiRequestProps> = ({
    showButton = false,
    buttonText = "Aksi",
    onButtonClick,
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);

    const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get("status") || "All");
    const [selectedMinDate, setSelectedMinDate] = useState<string>(searchParams.get("minStartDate") || "");
    const [selectedMaxDate, setSelectedMaxDate] = useState<string>(searchParams.get("maxEndDate") || "");
    const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("search") || "");

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { data, isLoading, error } = useCuti().fetchAllCuti({
        page: currentPage,
        limit: itemsPerPage,
        status: selectedStatus !== "All" ? selectedStatus : undefined,
        minStartDate: selectedMinDate || undefined,
        maxEndDate: selectedMaxDate || undefined,
        search: searchQuery || undefined,
    });

    const cuti = data?.data || [];
    const totalItems = data?.meta?.total || 0;

    const computeTotalDays = (startStr?: string, endStr?: string) => {
        if (!startStr || !endStr) return 0;
        try {
            const start = parseISO(startStr);
            const end = parseISO(endStr);
            const msPerDay = 24 * 60 * 60 * 1000;
            const diff = Math.floor((end.getTime() - start.getTime()) / msPerDay);
            return diff >= 0 ? diff + 1 : 0;
        } catch {
            return 0;
        }
    };

    const getStatusColor = (ct: any) => {
        if (ct.status === CutiStatus.MENUNGGU) return "bg-yellow-100 text-yellow-800";
        if (ct.status === CutiStatus.DITERIMA) return "bg-green-100 text-green-800";
        if (ct.status === CutiStatus.DITOLAK) return "bg-red-100 text-red-800";
        return "bg-gray-100 text-gray-700";
    };

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedStatus && selectedStatus !== "All") params.set("status", selectedStatus);
        if (selectedMinDate) params.set("minStartDate", selectedMinDate);
        if (selectedMaxDate) params.set("maxEndDate", selectedMaxDate);
        if (searchQuery) params.set("search", searchQuery);
        router.replace(`?${params.toString()}`);
    }, [selectedStatus, selectedMinDate, selectedMaxDate, searchQuery, router]);

    const handleApplyFilters = (filters: Record<string, string | undefined>) => {
        setSelectedMinDate(filters.minStartDate || "");
        setSelectedMaxDate(filters.maxEndDate || "");
        setSelectedStatus(filters.status || "All");
        setCurrentPage(1);
    };

    const filterFields = [
        { key: "minStartDate", label: "From", type: "date" as const },
        { key: "maxEndDate", label: "To", type: "date" as const },
        { key: "status", label: "Status", type: "select" as const, options: Object.values(CutiStatus) },
    ];
    
    const initialValues = {
        minStartDate: selectedMinDate,
        maxEndDate: selectedMaxDate,
        status: selectedStatus,
    };

    if (error) {
        return <div className="text-center text-red-500 py-6">Error: {error.message}</div>;
    }

    return (
        <div className="flex flex-col gap-4 w-full relative">
            <div className="flex flex-wrap md:items-center gap-3">
                <div className="flex flex-wrap items-center gap-4">
                    <div
                        onClick={() => setIsFilterOpen((v) => !v)}
                        className="group px-4 py-2 bg-(--color-background) border border-(--color-border) rounded-lg text-sm font-medium text-(--color-textPrimary) hover:bg-(--color-primary) hover:text-(--color-surface) transition cursor-pointer flex items-center gap-2"
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
                {(selectedStatus !== "All" || selectedMinDate || selectedMaxDate) && (
                    <>
                        {selectedStatus !== "All" && (
                            <span
                                className="flex items-center gap-2 bg-(--color-background) border border-(--color-border) px-4 py-2 rounded-lg text-sm"
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

                        {selectedMinDate && (
                            <span
                                className="flex items-center gap-2 bg-(--color-background) border border-(--color-border) px-4 py-2 rounded-lg text-sm"
                            >
                                From: {selectedMinDate}
                                <button
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    onClick={() => setSelectedMinDate("")}
                                >
                                    ✕
                                </button>
                            </span>
                        )}

                        {selectedMaxDate && (
                            <span
                                className="flex items-center gap-2 bg-(--color-background) border border-(--color-border) px-4 py-2 rounded-lg text-sm"
                            >
                                To: {selectedMaxDate}
                                <button
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    onClick={() => setSelectedMaxDate("")}
                                >
                                    ✕
                                </button>
                            </span>
                        )}
                    </>
                )}
            </div>

            {isLoading ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: itemsPerPage }).map((_, i) => (
                    <div key={i} className="animate-pulse w-full bg-slate-200 h-48 rounded-xl" />
                ))}
                </div>
            ) : cuti.length > 0 ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cuti.map((ct: any) => {
                        const days = computeTotalDays(ct.startDate, ct.endDate);
                        return (
                            <Link
                                key={ct.id}
                                href={`/dashboard/cuti-karyawan/${ct.id}`}
                                className="group block bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                            >
                                <div className="p-5 flex flex-col gap-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400 font-medium truncate max-w-[120px]">
                                            {ct.id}
                                        </span>

                                        <span className="px-3 py-1 text-xs font-semibold rounded-full border border-gray-300 bg-gray-50 text-gray-700">
                                            {ct.user?.minorRole}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-3 mt-2">
                                        <h2 className="font-semibold text-lg text-(--color-text-primary)">{ct.user?.name}</h2>
                                        <div className="flex justify-between">
                                            <div className="text-sm text-gray-500 flex gap-2 items-center justify-center">
                                                <Image
                                                    src={icons.dateIn}
                                                    alt="Tanggal Mulai Cuti"
                                                    width={24}
                                                    height={24}
                                                />
                                                {ct.startDate ? format(new Date(ct.startDate), "dd MMM yyyy") : "-"}
                                            </div>
                                            <div className="text-sm text-gray-500 flex gap-2 items-center justify-center">
                                                <Image
                                                    src={icons.dateOut}
                                                    alt="Tanggal Berakhir Cuti"
                                                    width={24}
                                                    height={24}
                                                />
                                                {ct.endDate ? format(new Date(ct.endDate), "dd MMM yyyy") : "-"}
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="text-sm text-(--color-text-secondary)">Total Cuti: {days} Hari</p>
                                            <span
                                                className={`px-3 py-1 text-xs font-semibold rounded-lg uppercase text-center w-fit 
                                                ${getStatusColor(
                                                    ct
                                                )}`}
                                            >
                                                {ct.status}
                                            </span>
                                        </div>
                                    </div>

                                    {showButton && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onButtonClick?.(ct.id);
                                                router.push(`/dashboard/cuti-karyawan/${ct.id}`);
                                            }}
                                            className="mt-3 w-full py-2 rounded-lg text-sm font-semibold bg-(--color-primary) text-white hover:bg-(--color-tertiary) hover:text-(--color-secondary) transition cursor-pointer"
                                        >
                                            {ct.status === CutiStatus.MENUNGGU ? <p>{buttonText}</p> : <p>Detail Cuti Karyawan</p>}
                                        </button>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-6">Tidak ada data cuti sesuai filter.</p>
            )}

            {cuti.length > 0 && !isLoading && (
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
};

export default CutiShows;
