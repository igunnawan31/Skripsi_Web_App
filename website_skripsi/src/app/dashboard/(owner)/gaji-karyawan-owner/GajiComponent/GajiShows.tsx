"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import { useSearchParams, useRouter } from "next/navigation";
import { GajiRequestProps } from "@/app/props/HRProps/GajiProps";
import { useGaji } from "@/app/lib/hooks/gaji/useGaji";
import { SalaryResponse, SalaryStatus } from "@/app/lib/types/gaji/gajiTypes";
import FilterModal from "@/app/dashboard/dashboardComponents/allComponents/FilterModal";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import Image from "next/image";
import { icons, logo } from "@/app/lib/assets/assets";
import { format } from "date-fns";

const GajiShows: React.FC<GajiRequestProps & { externalBulan?: string, onBulanChange?: (d: string) => void }> = ({
    showButton = false,
    buttonText = "Aksi",
    onButtonClick,
    externalBulan,
    onBulanChange
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get("status") || "All");
    const [selectedMinDueDate, setSelectedMinDueDate] = useState<string>(searchParams.get("minDueDate") || today);
    const [selectedMaxDueDate, setSelectedMaxDueDate] = useState<string>(searchParams.get("minDueDate") || today);
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
    const { data, isLoading, error } = useGaji().fetchAllSalaries({
        page: currentPage,
        limit: itemsPerPage,
        minDueDate: monthMin || (selectedMinDueDate ? new Date(selectedMinDueDate).toISOString() : undefined),
        maxDueDate: monthMax || (selectedMaxDueDate ? new Date(selectedMaxDueDate).toISOString() : undefined),
        status: selectedStatus !== "All" ? selectedStatus : undefined,
        searchTerm: searchQuery || undefined,
    });

    const salaries = data?.data || [];
    const totalItems = data?.meta?.total || 0;

    const getStatusColor = (sl: SalaryResponse) => {
        const today = new Date();
        const due = new Date(sl.dueDate);

        if (sl.status === SalaryStatus.PENDING && due > today) 
            return "bg-yellow-100 text-yellow-800";

        if (sl.status === SalaryStatus.PAID) 
            return "bg-green-100 text-green-800";

        if (sl.status === SalaryStatus.OVERDUE) 
            return "bg-red-100 text-red-800";

        if (sl.status === SalaryStatus.PENDING && due < today)
            return "bg-red-100 text-red-800";

        return "bg-gray-100 text-gray-700";
    };

    const getStatusReal = (sl: SalaryResponse) => {
        const today = new Date();
        const due = new Date(sl.dueDate);

        if (sl.status === SalaryStatus.PENDING && due < today) {
            return SalaryStatus.OVERDUE
        }
        if (sl.status === SalaryStatus.PENDING && due > today) {
            return SalaryStatus.PENDING
        }
        if (sl.status === SalaryStatus.PAID) {
            return SalaryStatus.PAID
        }
    }

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedStatus && selectedStatus !== "All") params.set("status", selectedStatus);
        if (selectedBulan) params.set("bulan", selectedBulan);
        if (searchQuery) params.set("searchTerm", searchQuery);
        router.replace(`?${params.toString()}`);
    }, [selectedStatus, selectedBulan, router]);

    const handleApplyFilters = (filters: Record<string, string | undefined>) => {
        const now = new Date();
        const currentYearMonth = `${now.getFullYear()}-${String(
            now.getMonth() + 1
        ).padStart(2, "0")}`;

        setSelectedStatus(filters.status || "All");
        const newBulan = filters.bulan || currentYearMonth;
        setSelectedStatus(filters.status || "All");
        
        if (onBulanChange) {
            onBulanChange(newBulan);
        }
        setCurrentPage(1);
    };

    const filterFields = [
        { key: "bulan", label: "Pilih Bulan", type: "month" as const },
        { key: "status", label: "Status Pembayaran", type: "select" as const, options: Object.values(SalaryStatus).filter(status => status !== SalaryStatus.OVERDUE) },
    ];

    const initialValues = {
        bulan: selectedBulan,
        status: selectedStatus
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
                {(selectedStatus !== "All" || searchQuery || selectedBulan) && (
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
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: itemsPerPage }).map((_, i) => (
                        <div
                            key={i}
                            className="animate-pulse w-full bg-slate-200 h-48 rounded-xl"
                        ></div>
                    ))}
                </div>
            ) : salaries.length > 0 ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {salaries.map((sl: SalaryResponse) => (
                        <Link
                            key={sl.id}
                            href={`/dashboard/gaji-karyawan/${sl.id}`}
                            className="group block bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                        >
                            <div className="p-5 flex flex-col gap-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400 font-medium truncate max-w-[120px] sm:max-w-full">
                                        {sl.id}
                                    </span>

                                    <span className="px-3 py-1 text-xs font-semibold rounded-full border border-gray-300 bg-gray-50 text-gray-700">
                                        {sl.user?.minorRole}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-3 mt-2">
                                    <h2 className="font-semibold text-lg uppercase">{sl.user.name}</h2>
                                    <div className="flex flex-col sm:flex-row sm:justify-between items-start">
                                        <div className="flex gap-2 items-center justify-center">
                                            <Image
                                                src={icons.dateIn}
                                                alt="Tanggal Mulai Cuti"
                                                width={32}
                                                height={32}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold">Due Date</span>
                                                <span className="text-xs">{sl.dueDate ? format(new Date(sl.dueDate), "dd MMM yyyy") : "-"}</span>
                                            </div>
                                        </div>
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-lg uppercase text-center w-fit 
                                            ${getStatusColor(
                                                    sl
                                                )}`}
                                            >
                                                {getStatusReal(sl)}
                                        </span>
                                    </div>
                                    <p className="text-2xl">
                                        {sl.amount.toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        })}
                                    </p>
                                </div>

                                {showButton && (
                                    (sl.status === SalaryStatus.PENDING || sl.status === SalaryStatus.OVERDUE) ? (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onButtonClick?.(sl.id);
                                                router.push(`/dashboard/gaji-karyawan/${sl.id}`);
                                            }}
                                            className="mt-3 w-full py-2 rounded-lg text-sm font-semibold bg-(--color-primary) text-white hover:bg-(--color-tertiary) hover:text-(--color-secondary) transition cursor-pointer"
                                        >
                                            <p>{buttonText}</p>
                                        </button>
                                    ): (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onButtonClick?.(sl.id);
                                                router.push(`/dashboard/gaji-karyawan/${sl.id}`);
                                            }}
                                            className="mt-3 w-full py-2 rounded-lg text-sm font-semibold bg-(--color-success) text-white hover:bg-(--color-tertiary) hover:text-(--color-secondary) transition cursor-pointer"
                                        >
                                            <p>Lihat Detail Salary Karyawan</p>
                                        </button>
                                    )
                                )}
                            </div>
                        </Link>
                    ))}
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
                            Data Gaji Karyawan Tidak Ditemukan
                        </h1>
                        <span className="text-sm text-(--color-muted)">Ubah hasil pencarian atau filter kamu</span>
                    </div>
                </div>
            )}

            {salaries.length > 0 && !isLoading && (
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

export default GajiShows;
