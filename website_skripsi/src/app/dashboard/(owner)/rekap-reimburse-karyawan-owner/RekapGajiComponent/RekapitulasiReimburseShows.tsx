"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { icons, logo } from "@/app/lib/assets/assets";
import { useUser } from "@/app/lib/hooks/user/useUser";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import Link from "next/link";
import { MajorRole } from "@/app/lib/types/enumTypes";
import { useReimburse } from "@/app/lib/hooks/reimburse/useReimburse";
import { ApprovalStatus } from "@/app/lib/types/reimburse/reimburseTypes";
import { endOfMonth, format, startOfMonth } from "date-fns";
import FilterModal from "@/app/dashboard/dashboardComponents/allComponents/FilterModal";

const RekapitulasiReimburseShows = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

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

    const { data: reimburseData, isLoading: isLoadingReimburse, error: errorReimburse } = useReimburse().fetchAllReimburse({ 
        limit: 1000,
        minSubmittedDate: startOfMonth(new Date(selectedBulan + "-01")).toISOString(),
        maxSubmittedDate: endOfMonth(new Date(selectedBulan + "-01")).toISOString(),
    });

    const users = usersData?.data.filter((m: any) => m.majorRole !== MajorRole.OWNER) || [];
    const totalItems = usersData?.meta?.total || 0;

    const toggleUser = (userId: string) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedBulan) params.set("bulan", selectedBulan);
        if (searchQuery) params.set("searchTerm", searchQuery);
        router.replace(`?${params.toString()}`);
    }, [selectedBulan, searchQuery, router]);
    
    const getStatusColor = (status: string) => {
        if (status === ApprovalStatus.PENDING) return "bg-yellow-100 text-yellow-800";
        if (status === ApprovalStatus.APPROVED) return "bg-green-100 text-green-800";
        if (status === ApprovalStatus.REJECTED) return "bg-red-100 text-red-800";
        return "bg-gray-200 text-gray-700";
    };

    const handleApplyFilters = (filters: Record<string, string | undefined>) => {
        setSelectedBulan(filters.bulan || defaultMonth);
        setCurrentPage(1);
    };

    const filterFields = [
        { key: "bulan", label: "Pilih Bulan", type: "month" as const },
    ];

    const initialValues = {
        bulan: selectedBulan,
    };

    if (errorUsers || errorReimburse) {
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
                        {errorUsers?.message || errorReimburse?.message || "Terdapat kendala pada sistem"}
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
                            <span className="flex items-center gap-2 bg-(--color-surface) border border-(--color-border) px-4 py-2 rounded-lg text-sm">
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

            {isLoadingUsers || isLoadingReimburse ? (
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
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-(--color-secondary) camelCase">
                                        No
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-(--color-secondary) camelCase">
                                        Nama Karyawan
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-(--color-secondary) camelCase">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-(--color-secondary) camelCase">
                                        Jumlah Reimburse
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-(--color-secondary) camelCase">
                                        Total Amount
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-(--color-secondary) camelCase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-(--color-border)">
                                {users.map((user: any, index: number) => {
                                    const userReimburses = (reimburseData?.data || []).filter(
                                        (r: any) => r.userId === user.id || r.requester?.id === user.id
                                    );
                                    const isExpanded = expandedUserId === user.id;

                                    const totalAmount = userReimburses.reduce(
                                        (acc: number, curr: any) => acc + (curr.totalExpenses || 0), 
                                        0
                                    );

                                    const approvedCount = userReimburses.filter(
                                        (r: any) => r.approvalStatus === ApprovalStatus.APPROVED
                                    ).length;

                                    return (
                                        <React.Fragment key={user.id}>
                                            <tr className={`hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-blue-50/30' : ''}`}>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-slate-900">{user.name}</span>
                                                        <span className="text-xs text-slate-500">{user.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 text-sm rounded-full bg-yellow-500 text-white font-medium">
                                                        {user.minorRole}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className="text-sm font-bold text-gray-900">
                                                            {userReimburses.length}
                                                        </span>
                                                        <span className="text-xs text-(--color-success)">
                                                            {approvedCount} Approved
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                                                    Rp {totalAmount.toLocaleString("id-ID")}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => toggleUser(user.id)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-black transition cursor-pointer"
                                                    >
                                                        {isExpanded ? "Tutup" : "Lihat Detail"}
                                                        <Image 
                                                            src={icons.arrowMenu} 
                                                            alt="chevron" 
                                                            width={12} 
                                                            height={12} 
                                                            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                        />
                                                    </button>
                                                </td>
                                            </tr>

                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan={6} className="bg-slate-50 p-0 border-b border-(--color-border)">
                                                        <div className="px-6 py-4 flex flex-col gap-3">
                                                            <p className="text-sm font-bold text-(--color-secondary) uppercase tracking-wider">
                                                                Daftar Reimburse:
                                                            </p>
                                                            {userReimburses.length > 0 ? (
                                                                userReimburses.map((reimburse: any) => (
                                                                    <div 
                                                                        key={reimburse.id} 
                                                                        className="flex items-center justify-between bg-white p-4 rounded-xl border border-(--color-border) shadow-sm hover:shadow-md transition"
                                                                    >
                                                                        <div className="flex flex-col gap-1 w-1/3">
                                                                            <span className="text-sm font-bold text-slate-800">
                                                                                {reimburse.title}
                                                                            </span>
                                                                            <span className="text-xs text-slate-500">
                                                                                {format(new Date(reimburse.createdAt), "dd MMM yyyy")}
                                                                            </span>
                                                                        </div>

                                                                        <div className="flex flex-col items-center w-1/4">
                                                                            <span className="text-sm font-bold text-(--color-success)">
                                                                                Rp {reimburse.totalExpenses.toLocaleString("id-ID")}
                                                                            </span>
                                                                            <span className="text-xs text-gray-500">
                                                                                Total Expenses
                                                                            </span>
                                                                        </div>

                                                                        <div className="w-1/4 text-center">
                                                                            <span 
                                                                                className={`px-3 py-1 text-xs font-semibold rounded-lg uppercase ${getStatusColor(
                                                                                    reimburse.approvalStatus
                                                                                )}`}
                                                                            >
                                                                                {reimburse.approvalStatus}
                                                                            </span>
                                                                        </div>

                                                                        <div className="w-auto">
                                                                            <Link
                                                                                href={`/dashboard/pengajuan-reimburse/${reimburse.id}`}
                                                                                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition cursor-pointer"
                                                                            >
                                                                                <Image
                                                                                    src={icons.viewLogo}
                                                                                    alt="View"
                                                                                    width={16}
                                                                                    height={16}
                                                                                />
                                                                                Lihat Detail
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="text-center py-8 text-gray-500 italic">
                                                                    Tidak ada reimburse untuk periode ini
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
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

export default RekapitulasiReimburseShows;