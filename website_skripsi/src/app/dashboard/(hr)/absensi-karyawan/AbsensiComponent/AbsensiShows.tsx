"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import { Absensi, MinorRole } from "@/app/lib/types/types";
import { AbsensiRequestProps } from "@/app/props/HRProps/AbsensiProps";
import { useSearchParams, useRouter } from "next/navigation";
import { useAbsensi } from "@/app/lib/hooks/absensi/useAbsensi";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import Image from "next/image";
import { icons, logo } from "@/app/lib/assets/assets";
import FilterModal from "@/app/dashboard/dashboardComponents/allComponents/FilterModal";
import { format } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

const AbsensiShows: React.FC<AbsensiRequestProps & { externalDate?: string, onDateChange?: (d: string) => void }> = ({
    showButton = false,
    buttonText = "Aksi",
    onButtonClick,
    externalDate,
    onDateChange
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const today = new Date().toISOString().split("T")[0];

    const selectedDate = externalDate || today;
    const [selectedMinorRole, setSelectedMinorRole] = useState<string>(searchParams.get("minorRole") || "All");
    const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("searchTerm") || "");

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const { data, isLoading, error } = useAbsensi().fetchAllAbsensi({
        page: currentPage,
        limit: itemsPerPage,
        date: selectedDate
            ? new Date(`${selectedDate}T00:00:00`).toISOString()
            : undefined,
        searchTerm: searchQuery || undefined,
    });

    const absen = data?.data || [];
    const totalItems = data?.meta?.total || 0;

    const getCheckInStatus = (checkIn?: string) => {
        if (!checkIn) return "Tidak Absen";

        const zonedCheckIn = toZonedTime(checkIn, "Asia/Jakarta");
        
        const limit = new Date(zonedCheckIn);
        limit.setHours(8, 30, 0, 0);

        return zonedCheckIn > limit ? "Terlambat" : "Tepat Waktu";
    };

    const toWIB = (dateString?: string) => {
        if (!dateString) return "-";
        try {
            const zoned = toZonedTime(dateString, "Asia/Jakarta");
            return format(zoned, "HH:mm");
        } catch (e) {
            return "-";
        }
    }

    const getStatusColor = (absen: any) => {
        if (getCheckInStatus(absen.checkIn) === "Tepat Waktu") return "bg-green-100 text-green-800";
        if (getCheckInStatus(absen.checkIn) === "Terlambat") return "bg-red-100 text-red-800";
        return "bg-gray-100 text-gray-700";
    };

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedDate) params.set("date", selectedDate);
        if (searchQuery) params.set("searchTerm", searchQuery);
        router.replace(`?${params.toString()}`);
    }, [selectedDate, searchQuery, router]);

    const handleApplyFilters = (filters: Record<string, string | undefined>) => {
        if (filters.date && onDateChange) {
            onDateChange(filters.date);
        }
        setCurrentPage(1);
    };

    const filterFields = [
        { key: "date", label: "Date", type: "date" as const },
    ];

    const initialValues = {
        date: today,
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
                {(selectedDate || searchQuery) && (
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
                        {selectedDate && (
                            <span className="flex items-center gap-2 bg-(--color-surface) border border-(--color-border) px-4 py-2 rounded-lg text-sm font-medium">
                                Date: {format(new Date(selectedDate), "dd MMM yyyy")}
                                <button
                                    className="text-red-500 hover:text-red-700 cursor-pointer font-bold ml-1"
                                    onClick={() => onDateChange?.(today)}
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
            ) : absen.length > 0 ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {absen.map((abs: any) => (
                        <Link
                            key={abs.user.id}
                            href={`/dashboard/absensi-karyawan/${abs.user.id}`}
                            className="group bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                        >
                            <div className="p-5 flex flex-col gap-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400 font-medium truncate max-w-[120px] sm:max-w-full">
                                        {abs.user.id}
                                    </span>

                                    <span className="px-3 py-1 text-xs font-semibold rounded-full border border-gray-300 bg-gray-50 text-gray-700">
                                        {abs.user?.minorRole}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-3 mt-2">
                                    <h2 className="font-semibold text-lg text-(--color-text-primary)">{abs.user.name}</h2>
                                    <div className="text-sm text-gray-500 flex gap-2 items-center justify-left">
                                        <Image
                                            src={icons.dateIn}
                                            alt="Tanggal Mulai Cuti"
                                            width={24}
                                            height={24}
                                        />
                                        {abs.checkIn ? format(new Date(abs.checkIn), "dd MMM yyyy") : "-"}
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between items-start">
                                        <div className="text-sm text-gray-500 flex gap-2 items-center justify-center">
                                            <Image
                                                src={icons.clockIn}
                                                alt="Jam Check In Absensi"
                                                width={24}
                                                height={24}
                                            />
                                            {toWIB(abs.checkIn)}
                                        </div>
                                        <div className="text-sm text-gray-500 flex gap-2 items-center justify-center">
                                            <Image
                                                src={icons.clockOut}
                                                alt="Jam Check Out Absensi"
                                                width={24}
                                                height={24}
                                            />
                                            {toWIB(abs.checkOut)}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-(--color-text-secondary)">
                                            Status:
                                        </p>
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-lg uppercase text-center w-fit 
                                            ${getStatusColor(
                                                abs
                                            )}`}
                                        >
                                            {getCheckInStatus(abs.checkIn)}
                                        </span>
                                    </div>
                                </div>

                                {showButton && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onButtonClick?.(abs.user.id);
                                            router.push(`/dashboard/absensi-karyawan/${abs.user.id}?date=${abs.checkIn}`);
                                        }}
                                        className="mt-3 w-full py-2 rounded-lg text-sm font-semibold bg-(--color-primary) text-white hover:bg-(--color-tertiary) hover:text-(--color-secondary) transition cursor-pointer"
                                    >
                                        {buttonText || "Absen Lebih Lanjut"}
                                    </button>
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
                            Pencarian Nama Karyawan Tidak Ditemukan
                        </h1>
                        <span className="text-sm text-(--color-muted)">Ubah hasil pencarian kamu</span>
                    </div>
                </div>
            )}

            {absen.length > 10 && !isLoading && (
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

export default AbsensiShows;
