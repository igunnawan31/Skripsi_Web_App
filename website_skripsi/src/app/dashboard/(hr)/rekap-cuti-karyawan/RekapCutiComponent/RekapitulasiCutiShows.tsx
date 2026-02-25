"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { icons, logo } from "@/app/lib/assets/assets";
import { useUser } from "@/app/lib/hooks/user/useUser";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from "date-fns";
import Link from "next/link";
import { useKontrak } from "@/app/lib/hooks/kontrak/useKontrak";
import { CutiStatus, MajorRole } from "@/app/lib/types/enumTypes";
import FilterModal from "@/app/dashboard/dashboardComponents/allComponents/FilterModal";
import { useCuti } from "@/app/lib/hooks/cuti/useCuti";

const RekapitulasiCutiShows = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const today = new Date();
    const defaultMonth = format(today, "yyyy-MM");
    const [selectedBulan, setSelectedBulan] = useState(searchParams.get("bulan") || defaultMonth);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("searchTerm") || "");

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const { data: usersData, isLoading: isLoadingUsers, error: errorUsers } = useUser().fetchAllUser({
        page: currentPage,
        limit: itemsPerPage,
        searchTerm: searchQuery || undefined,
    });
    const { data: kontrakData, isLoading: isLoadingKontrak, error: errorKontrak } = useKontrak().fetchAllKontrak();
    const { data: cutiData, isLoading: isLoadingCuti, error: errorCuti } = useCuti().fetchAllCuti({ 
        limit: 1000,
        status: CutiStatus.DITERIMA,
        minStartDate: startOfMonth(new Date(selectedBulan + "-01")).toISOString(),
        maxEndDate: endOfMonth(new Date(selectedBulan + "-01")).toISOString(),
    });

    const users = usersData?.data.filter((m: any) => m.majorRole !== MajorRole.OWNER) || [];
    const allKontrak = kontrakData?.data || [];

    const getUserCutiDays = (userId: string) => {
        const userKontrak = allKontrak.find((k: any) => 
            (k.user?.id === userId || k.userId === userId) && 
            k.status === "ACTIVE"
        );
        
        if (userKontrak && userKontrak.cutiBulanan && userKontrak.cutiBulanan > 0) {
            return userKontrak.cutiBulanan;
        }
    };

    const getUserCutiCount = (userId: string) => {
        if (!cutiData?.data) return 0;

        const monthDate = new Date(selectedBulan + "-01");
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);

        return cutiData.data.reduce((total: number, cuti: any) => {
            const isSameUser = cuti.userId === userId || cuti.user?.id === userId;
            const isApproved = cuti.status === CutiStatus.DITERIMA; 

            if (isSameUser && isApproved) {
                const startDate = new Date(cuti.startDate);
                const endDate = new Date(cuti.endDate);

                const calculationStart = startDate < monthStart ? monthStart : startDate;
                const calculationEnd = endDate > monthEnd ? monthEnd : endDate;

                if (calculationStart <= calculationEnd) {
                    const diffTime = Math.abs(calculationEnd.getTime() - calculationStart.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    return total + diffDays;
                }
            }
            return total;
        }, 0);
    };

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedBulan) params.set("bulan", selectedBulan);
        if (searchQuery) params.set("searchTerm", searchQuery);
        router.replace(`?${params.toString()}`);
    }, [selectedBulan, searchQuery, router]);


    const handleApplyFilters = (filters: Record<string, string | undefined>) => {
        setSelectedBulan(filters.bulan || "");
        setCurrentPage(1);
    };

    const filterFields = [
        { key: "bulan", label: "Pilih Bulan", type: "month" as const },
    ];

    const initialValues = {
        bulan: selectedBulan,
    };

    if (errorUsers || errorKontrak || errorCuti) {
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
                        {errorUsers?.message || errorKontrak?.message || "Terdapat kendala pada sistem"}
                    </h1>
                    <span className="text-sm text-(--color-primary)">Mohon untuk melakukan refresh atau kembali ketika sistem sudah selesai diperbaiki</span>
                </div>
            </div>
        );

        return errorRender;
    }

    return (
        <div className="flex flex-col gap-4 w-full relative">
            <SearchBar
                placeholder="Cari nama karyawan..."
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

                {(searchQuery || selectedBulan) && (
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
                        {selectedBulan && (
                            <span className="flex items-center gap-2 bg-(--color-surface) border border-(--color-border) px-4 py-2 rounded-lg text-sm">
                                Bulan: {format(new Date(selectedBulan + "-01"), "MMM yyyy")}
                                <button
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    onClick={() => {
                                        setSelectedBulan(defaultMonth); 
                                        setCurrentPage(1);
                                    }}
                                >
                                    ✕
                                </button>
                            </span>
                        )}
                    </>
                )}
            </div>

            {isLoadingUsers || isLoadingKontrak || isLoadingCuti ? (
                <div className="flex flex-col gap-4">
                    {Array.from({ length: itemsPerPage }).map((_, i) => (
                        <div key={i} className="animate-pulse w-full bg-slate-200 h-20 rounded-xl"></div>
                    ))}
                </div>
            ) : users.length > 0 ? (
                <div className="w-full bg-(--color-surface) rounded-2xl shadow-md border border-(--color-border) overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-(--color-border)">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-(--color-secondary) camelCase">
                                        No
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-(--color-secondary) camelCase">
                                        Nama Karyawan
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-(--color-secondary) camelCase">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-(--color-secondary) camelCase">
                                        Cuti
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-(--color-secondary) camelCase">
                                        Persentase
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-(--color-secondary) camelCase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-(--color-border)">
                                {users.map((user: any, index: number) => {
                                    const totalCutiDays = getUserCutiDays(user?.id);
                                    const cutiCount = getUserCutiCount(user.id);
                                    const percentage = totalCutiDays > 0 
                                        ? ((cutiCount / totalCutiDays) * 100).toFixed(1) 
                                        : 0;

                                    return (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-(--color-text-primary)">
                                                        {user.name}
                                                    </span>
                                                    <span className="text-sm text-(--color-muted)">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 text-sm rounded-full bg-yellow-500 text-white">
                                                    {user.minorRole}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {cutiCount} / {totalCutiDays ? totalCutiDays : "-"} hari
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span 
                                                    className={`px-3 py-1 text-sm font-semibold rounded-lg ${
                                                        Number(percentage) > 80 
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-green-100 text-green-800"
                                                    }`}
                                                >
                                                    {percentage}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Link
                                                    href={`/dashboard/rekap-cuti-karyawan/${user.id}?month=${selectedBulan}`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition cursor-pointer"
                                                >
                                                    <Image
                                                        src={icons.viewLogo}
                                                        alt="View"
                                                        width={16}
                                                        height={16}
                                                    />
                                                    See More
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-between gap-4 py-8">
                    <Image src={logo.notFound} width={120} height={120} alt="Not Found" />
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-bold text-(--color-text-primary)">
                            Data Karyawan Tidak Ditemukan
                        </h1>
                        <span className="text-sm text-(--color-muted)">
                            Ubah hasil pencarian kamu
                        </span>
                    </div>
                </div>
            )}

            {users.length > 0 && !isLoadingUsers && (
                <div className="mt-6">
                    <PaginationBar
                        totalItems={users.length}
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

export default RekapitulasiCutiShows;