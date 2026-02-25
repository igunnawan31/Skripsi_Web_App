"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import { useSearchParams, useRouter } from "next/navigation";
import FilterModal from "@/app/dashboard/dashboardComponents/allComponents/FilterModal";
import { format, } from "date-fns";
import { icons, logo } from "@/app/lib/assets/assets";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import Image from "next/image";
import { useReimburse } from "@/app/lib/hooks/reimburse/useReimburse";
import { ApprovalStatus } from "@/app/lib/types/reimburse/reimburseTypes";
import { GajiRequestProps } from "@/app/props/HRProps/GajiProps";

const ReimburseShows: React.FC<GajiRequestProps & { externalBulan?: string, onBulanChange?: (d: string) => void }> = ({
    showButton = false,
    buttonText = "Aksi",
    onButtonClick,
    externalBulan,
    onBulanChange
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get("approvalStatus") || "All");
    const [selectedMinDate, setSelectedMinDate] = useState<string>(searchParams.get("minSubmittedDate") || "");
    const [selectedMaxDate, setSelectedMaxDate] = useState<string>(searchParams.get("maxSubmittedDate") || "");
    const selectedBulan = externalBulan || currentYearMonth;
    const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("searchTerm") || "");

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const getMonthRange = (monthString: string) => {
        if (!monthString) return { min: undefined, max: undefined };
        
        const [year, month] = monthString.split('-').map(Number);
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0, 23, 59, 59);
        
        return {
            min: firstDay.toISOString(),
            max: lastDay.toISOString()
        };
    };

    const safeBulan = selectedBulan || currentYearMonth;
    const { min: monthMin, max: monthMax } = getMonthRange(safeBulan);

    const { data, isLoading, error } = useReimburse().fetchAllReimburse({
        page: currentPage,
        limit: itemsPerPage,
        approvalStatus: selectedStatus !== "All" ? selectedStatus : undefined,
        minSubmittedDate: monthMin || (selectedMinDate ? new Date(selectedMinDate).toISOString() : undefined),
        maxSubmittedDate: monthMax || (selectedMaxDate ? new Date(selectedMaxDate).toISOString() : undefined),
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
        if (selectedBulan) params.set("bulan", selectedBulan);
        if (searchQuery) params.set("searchTerm", searchQuery);
        router.replace(`?${params.toString()}`);
    }, [selectedStatus, selectedMinDate, selectedMaxDate, searchQuery, router]);

    const handleApplyFilters = (filters: Record<string, string | undefined>) => {
        const now = new Date();
        const currentYearMonth = `${now.getFullYear()}-${String(
            now.getMonth() + 1
        ).padStart(2, "0")}`;
        
        const newBulan = filters.bulan || currentYearMonth;
        if (onBulanChange) {
            onBulanChange(newBulan);
        }

        setSelectedStatus(filters.approvalStatus || "All");
        setCurrentPage(1);
    };

    const filterFields = [
        { key: "bulan", label: "Pilih Bulan", type: "month" as const },
        { key: "approvalStatus", label: "Approval Status", type: "select" as const, options: Object.values(ApprovalStatus) },
    ];
    
    const initialValues = {
        bulan: selectedBulan,
        approvalStatus: selectedStatus,
    };

    if (error) {
        const errorRender = (
            <div className="flex flex-col items-center justify-between gap-4 py-4">
                <Image
                    src={logo.error}
                    width={240}
                    height={240}
                    alt="Not Found Data"
                />
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold text-(--color-primary)">
                        {error.message ? error.message : "Terdapat kendala pada sistem"}
                    </h1>
                    <span className="text-sm text-(--color-primary)">Mohon untuk melakukan refresh atau kembali ketika sistem sudah selesai diperbaiki</span>
                </div>
            </div>
        );

        return errorRender;
    };

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
                {(selectedStatus !== "All" || selectedBulan || searchQuery) && (
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

                        {selectedBulan && (
                            <span className="flex items-center gap-2 bg-(--color-surface) border border-(--color-border) px-4 py-2 rounded-lg text-sm">
                                Bulan:  {format(new Date(selectedBulan), "MMM yyyy")}
                                <button
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    onClick={() => onBulanChange?.(currentYearMonth)}
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
                <div className="flex flex-col items-center justify-between gap-4 py-4">
                    <Image
                        src={logo.notFound}
                        width={120}
                        height={120}
                        alt="Not Found Data"
                    />
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-bold text-(--color-text-primary)">
                            Data Reimburse Karyawan Tidak Ditemukan
                        </h1>
                        <span className="text-sm text-(--color-muted)">Ubah hasil pencarian atau filter kamu</span>
                    </div>
                </div>
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
