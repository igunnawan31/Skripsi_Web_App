"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import { Absensi, MinorRole } from "@/app/lib/types/types";
import { AbsensiRequestProps } from "@/app/props/HRProps/AbsensiProps";
import { fetchAbsensi } from "@/app/lib/hooks/dummyHooks/fetchAbsensi";
import { useSearchParams, useRouter } from "next/navigation";
import FilterBar from "@/app/dashboard/dashboardComponents/allComponents/FilterBar";
import { useAbsensi } from "@/app/lib/hooks/absensi/useAbsensi";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import FilterModal from "@/app/dashboard/dashboardComponents/allComponents/FilterModal";
import { format } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

const API = process.env.NEXT_PUBLIC_API_URL;

const AbsensiShows: React.FC<AbsensiRequestProps> = ({
    showButton = false,
    buttonText = "Aksi",
    onButtonClick,
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const today = new Date().toISOString().split("T")[0];

    const [selectedDate, setSelectedDate] = useState<string>(
        searchParams.get("date") || today
    );
    const [selectedRole, setSelectedRole] = useState<string>(searchParams.get("role") || "All");
    const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get("status") || "All");
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
        minorRole: selectedMinorRole !== "All" ? selectedMinorRole : undefined,
        status: selectedStatus !== "All" ? selectedStatus : undefined,
        searchTerm: searchQuery || undefined,
    });

    const absen = data?.data || [];
    const totalItems = data?.meta?.total || 0;

    const getCheckInStatus = (checkIn?: string) => {
        if (!checkIn) return "-";

        const checkInWIB = fromZonedTime(checkIn, "Asia/Jakarta");
        const limit = new Date(checkInWIB);
        limit.setUTCHours(8, 30, 0, 0);

        return checkInWIB > limit ? "Terlambat" : "Tepat Waktu";
    };

    const getTimeFromISO = (iso?: string) => {
        if (!iso) return "-";
        return iso.split("T")[1]?.substring(0, 5);
    };

    const getStatusColor = (absen: any) => {
        if (getCheckInStatus(absen.checkIn) === "Tepat Waktu") return "bg-green-100 text-green-800";
        if (getCheckInStatus(absen.checkIn) === "Terlambat") return "bg-red-100 text-red-800";
        return "bg-gray-100 text-gray-700";
    };

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedDate) params.set("date", selectedDate);
        if (selectedRole && selectedRole !== "All") params.set("role", selectedRole);
        if (selectedStatus && selectedStatus !== "All") params.set("status", selectedStatus);
        if (searchQuery) params.set("searchTerm", searchQuery);
        router.replace(`?${params.toString()}`);
    }, [selectedDate, selectedRole, selectedStatus, searchQuery, router]);

    const handleApplyFilters = (filters: Record<string, string | undefined>) => {
        setSelectedDate(filters.date || "");
        setSelectedMinorRole(filters.minorRole || "All");
        setSelectedStatus(filters.status || "All");
        setCurrentPage(1);
    };

    const filterFields = [
        { key: "date", label: "Date", type: "date" as const },
        { key: "minorRole", label: "Role", type: "select" as const, options: Object.values(MinorRole) },
    ];

    const initialValues = {
        date: today,
        MinorRole: selectedMinorRole,
        status: selectedStatus
    };

    if (error) {
        return <div className="text-center text-red-500 py-6">Error: {error.message}</div>;
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
                {(selectedStatus !== "All" || selectedDate || selectedMinorRole || searchQuery) && (
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
                        {selectedMinorRole !== "All" && (
                            <span
                                className="flex items-center gap-2 bg-(--color-surface) border border-(--color-border) px-4 py-2 rounded-lg text-sm"
                            >
                                Role: {selectedMinorRole}
                                <button
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    onClick={() => setSelectedMinorRole("All")}
                                >
                                    ✕
                                </button>
                            </span>
                        )}
                        {selectedDate && (
                            <span
                                className="flex items-center gap-2 bg-(--color-surface) border border-(--color-border) px-4 py-2 rounded-lg text-sm"
                            >
                                Date: {selectedDate}
                                <button
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    onClick={() => setSelectedDate(today)}
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
                                    <span className="text-gray-400 font-medium truncate max-w-[120px]">
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
                                            {getTimeFromISO(abs.checkIn)}
                                        </div>
                                        <div className="text-sm text-gray-500 flex gap-2 items-center justify-center">
                                            <Image
                                                src={icons.clockOut}
                                                alt="Jam Check Out Absensi"
                                                width={24}
                                                height={24}
                                            />
                                            {getTimeFromISO(abs.checkOut)}
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
                                            onButtonClick?.(abs.id);
                                            router.push(`/dashboard/absensi-karyawan/${abs.user.id}`);
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
                <p className="text-center text-gray-500 py-6">
                    Tidak ada data absensi sesuai filter.
                </p>
            )}

            {absen.length > 0 && !isLoading && (
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
