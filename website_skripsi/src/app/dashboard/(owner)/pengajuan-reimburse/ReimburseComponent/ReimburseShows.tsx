"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import { useSearchParams, useRouter } from "next/navigation";
import { CutiRequestProps } from "@/app/props/HRProps/cutiProps";
import FilterModal from "@/app/dashboard/dashboardComponents/allComponents/FilterModal";
import { format, parseISO } from "date-fns";
import { icons } from "@/app/lib/assets/assets";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import Image from "next/image";
import { useReimburse } from "@/app/lib/hooks/reimburse/useReimburse";
import { ApprovalStatus } from "@/app/lib/types/reimburse/reimburseTypes";

const ReimburseShows: React.FC<CutiRequestProps> = ({
    showButton = false,
    buttonText = "Aksi",
    onButtonClick,
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);

    const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get("approvalStatus") || "All");
    const [selectedMinDate, setSelectedMinDate] = useState<string>(searchParams.get("minSubmittedDate") || "");
    const [selectedMaxDate, setSelectedMaxDate] = useState<string>(searchParams.get("maxSubmittedDate") || "");
    const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("searchTerm") || "");

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const { data, isLoading, error } = useReimburse().fetchAllReimburse({
        page: currentPage,
        limit: itemsPerPage,
        approvalStatus: selectedStatus !== "All" ? selectedStatus : undefined,
        minSubmittedDate: selectedMinDate || undefined,
        maxSubmittedDate: selectedMaxDate || undefined,
        searchTerm: searchQuery || undefined,
    });

    const reimburse = data?.data || [];
    const totalItems = data?.meta?.total || 0;

    const getStatusColor = (ct: any) => {
        if (ct.approvalStatus === ApprovalStatus.PENDING) return "bg-yellow-100 text-yellow-800";
        if (ct.approvalStatus === ApprovalStatus.APPROVED) return "bg-green-100 text-green-800";
        if (ct.approvalStatus === ApprovalStatus.REJECTED) return "bg-red-100 text-red-800";
        return "bg-gray-200 text-gray-700";
    };

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedStatus && selectedStatus !== "All") params.set("approvalStatus", selectedStatus);
        if (selectedMinDate) params.set("minSubmittedDate", selectedMinDate);
        if (selectedMaxDate) params.set("maxSubmittedDate", selectedMaxDate);
        if (searchQuery) params.set("searchTerm", searchQuery);
        router.replace(`?${params.toString()}`);
    }, [selectedStatus, selectedMinDate, selectedMaxDate, searchQuery, router]);

    const handleApplyFilters = (filters: Record<string, string | undefined>) => {
        setSelectedMinDate(filters.minSubmittedDate || "");
        setSelectedMaxDate(filters.maxSubmittedDate || "");
        setSelectedStatus(filters.approvalStatus || "All");
        setCurrentPage(1);
    };

    const filterFields = [
        { key: "minSubmittedDate", label: "From", type: "date" as const },
        { key: "maxSubmittedDate", label: "To", type: "date" as const },
        { key: "approvalStatus", label: "Approval Status", type: "select" as const, options: Object.values(ApprovalStatus) },
    ];
    
    const initialValues = {
        minSubmittedDate: selectedMinDate,
        maxSubmittedDate: selectedMaxDate,
        approvalStatus: selectedStatus,
    };

    if (error) {
        return <div className="text-center text-red-500 py-6">Error: {error.message}</div>;
    }

    return (
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
                {(selectedStatus !== "All" || selectedMinDate || selectedMaxDate || searchQuery) && (
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

                        {selectedMinDate && (
                            <span
                                className="flex items-center gap-2 bg-(--color-surface) border border-(--color-border) px-4 py-2 rounded-lg text-sm"
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
                                className="flex items-center gap-2 bg-(--color-surface) border border-(--color-border) px-4 py-2 rounded-lg text-sm"
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: itemsPerPage }).map((_, i) => (
                        <div key={i} className="animate-pulse w-full bg-slate-200 h-48 rounded-xl" />
                    ))}
                </div>
            ) : reimburse.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {reimburse.map((ct: any) => {
                        return (
                            <Link
                                key={ct.id}
                                href={`/dashboard/pengajuan-reimburse/${ct.id}`}
                                className="group block bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                            >
                                <div className="p-5 flex flex-col gap-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400 font-medium truncate max-w-[120px]">
                                            {ct.id}
                                        </span>

                                        <div className="flex justify-between items-center">
                                            <span
                                                className={`px-3 py-1 text-xs font-semibold rounded-lg uppercase text-center w-fit 
                                                ${getStatusColor(
                                                    ct
                                                )}`}
                                            >
                                                {ct.approvalStatus}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 mt-2">
                                        <h2 className="font-semibold text-lg text-(--color-text-primary)">{ct.requester.name}</h2>
                                        <div className="flex flex-col sm:flex-row sm:justify-between items-start">
                                            <div className="text-sm text-gray-500 flex gap-2 items-center justify-center">
                                                <Image
                                                    src={icons.dateIn}
                                                    alt="Tanggal Mulai Reimburse"
                                                    width={24}
                                                    height={24}
                                                />
                                                {ct.createdAt ? format(new Date(ct.createdAt), "dd MMM yyyy") : "-"}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-(--color-text-secondary)">Pengeluaran :</p>
                                            <span
                                                className={"px-3 py-1 text-xs font-semibold rounded-lg uppercase text-center w-fit"}
                                            >
                                                {ct.totalExpenses.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                                            </span>
                                        </div>
                                    </div>

                                    {showButton && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onButtonClick?.(ct.id);
                                                router.push(`/dashboard/pengajuan-reimburse/${ct.id}`);
                                            }}
                                            className="mt-3 w-full py-2 rounded-lg text-sm font-semibold bg-(--color-primary) text-white hover:bg-(--color-tertiary) hover:text-(--color-secondary) transition cursor-pointer"
                                        >
                                            {ct.approvalStatus === ApprovalStatus.PENDING ? <p>{buttonText}</p> : <p>Detail Reimburse Karyawan</p>}
                                        </button>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-6">Tidak ada data reimburse sesuai filter.</p>
            )}

            {reimburse.length > 0 && !isLoading && (
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

export default ReimburseShows;
