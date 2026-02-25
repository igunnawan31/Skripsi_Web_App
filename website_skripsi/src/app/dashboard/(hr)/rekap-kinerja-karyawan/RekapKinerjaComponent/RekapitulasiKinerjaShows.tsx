"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { icons, logo } from "@/app/lib/assets/assets";
import { useUser } from "@/app/lib/hooks/user/useUser";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import Link from "next/link";
import { useKontrak } from "@/app/lib/hooks/kontrak/useKontrak";
import { GajiStatus, KontrakKerjaStatus, MajorRole } from "@/app/lib/types/enumTypes";
import { useGaji } from "@/app/lib/hooks/gaji/useGaji";

const RekapitulasiKinerjaShows = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("searchTerm") || "");

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
    const { data: gajiData, isLoading: isLoadingGaji, error: errorGaji } = useGaji().fetchAllSalaries({ limit: 1000 });

    const users = usersData?.data.filter((m: any) => m.majorRole !== MajorRole.OWNER) || [];
    const allKontrak = kontrakData?.data || [];

    const toggleUser = (userId: string) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    useEffect(() => {
        const params = new URLSearchParams();
        if (searchQuery) params.set("searchTerm", searchQuery);
        router.replace(`?${params.toString()}`);
    }, [searchQuery, router]);
    
    const getStatusColor = (ct: any) => {
        if (ct.status === KontrakKerjaStatus.ACTIVE) return "bg-yellow-100 text-yellow-800";
        if (ct.status === KontrakKerjaStatus.COMPLETED) return "bg-green-100 text-green-800";
        if (ct.status === KontrakKerjaStatus.ON_HOLD) return "bg-red-100 text-red-800";
        return "bg-gray-100 text-gray-700";
    };

    if (errorUsers || errorKontrak || errorGaji) {
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
                        {errorUsers?.message || errorKontrak?.message || errorGaji?.message || "Terdapat kendala pada sistem"}
                    </h1>
                    <span className="text-sm text-(--color-primary)">Mohon untuk melakukan refresh atau kembali ketika sistem sudah selesai diperbaiki</span>
                </div>
            </div>
        );

        return errorRender;
    }

    return (
        <div className="flex flex-col gap-2 w-full relative">
            <SearchBar
                placeholder="Cari nama karyawan..."
                onSearch={handleSearch}
            />
            <div className="flex flex-wrap md:items-center gap-3">
                {(searchQuery) && (
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
                    </>
                )}
            </div>

            {isLoadingUsers || isLoadingKontrak || isLoadingGaji ? (
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
                                        Project Terkait
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-(--color-secondary) camelCase">
                                        Sudah Dibayarkan (Rp) - Persentase (%)
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-(--color-secondary) camelCase">
                                        Total Dibayarkan
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-(--color-secondary) camelCase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-(--color-border)">
                                {users.map((user: any, index: number) => {
                                    const kontrakUser = allKontrak.filter((k: any) => k.userId === user.id);
                                    const isExpanded = expandedUserId === user.id;

                                    const totalPaid = (gajiData?.data || [])
                                        .filter((g: any) => g.userId === user.id && g.status === GajiStatus.DIBAYAR)
                                        .reduce((acc: number, curr: any) => acc + curr.amount, 0);

                                    return (
                                        <React.Fragment key={user.id}>
                                            <tr className={`hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-blue-50/30' : ''}`}>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-slate-900">{user.name}</span>
                                                        <span className="text-sm text-slate-500">{user.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 text-sm rounded-full bg-yellow-500 text-white font-medium">
                                                        {user.minorRole}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm font-semibold text-(--color-secondary)">
                                                    {kontrakUser.length} Kontrak Aktif
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm font-bold text-(--color-secondary)">
                                                    Rp {totalPaid.toLocaleString("id-ID")}
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm text-(--color-muted)">
                                                    Klik "Pilih Kontrak" untuk detail
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => toggleUser(user.id)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-black transition cursor-pointer"
                                                    >
                                                        {isExpanded ? "Tutup" : "Pilih Kontrak"}
                                                        <Image 
                                                            src={icons.arrowMenu} 
                                                            alt="chevron" 
                                                            width={12} 
                                                            height={12} 
                                                            className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                                        />
                                                    </button>
                                                </td>
                                            </tr>

                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan={7} className="bg-slate-50 p-0 border-b border-(--color-border)">
                                                        <div className="px-6 py-4 flex flex-col gap-3">
                                                            <p className="text-sm font-bold text-(--color-secondary) uppercase tracking-wider">Daftar Kontrak Spesifik:</p>
                                                            {kontrakUser.map((kontrak: any) => {
                                                                const kontrakGaji = (gajiData?.data || []).filter((g: any) => g.kontrakId === kontrak.id);
                                                                const kontrakDibayarkan = kontrakGaji
                                                                    .filter((g: any) => g.status === "PAID")
                                                                    .reduce((acc: number, curr: any) => acc + curr.amount, 0);
                                                                const pct = kontrak.totalBayaran > 0 
                                                                    ? ((kontrakDibayarkan / kontrak.totalBayaran) * 100).toFixed(1) 
                                                                    : "0";

                                                                return (
                                                                    <div key={kontrak.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-(--color-border) shadow-sm">
                                                                        <div className="flex flex-col gap-1 w-1/3">
                                                                            <span className="text-sm font-bold text-slate-800">
                                                                                {kontrak.project?.name || "Project General"}
                                                                            </span>
                                                                            <span className="text-sm text-slate-500">ID: {kontrak.id}</span>
                                                                        </div>

                                                                        <div className="flex flex-col items-center w-1/4">
                                                                            <span className="text-sm text-(--color-success)">
                                                                                Rp {kontrakDibayarkan.toLocaleString("id-ID")} / Rp {kontrak.totalBayaran.toLocaleString("id-ID")}
                                                                            </span>
                                                                            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                                                                                <div className="bg-(--color-success) h-1.5 rounded-full" style={{ width: `${Math.min(Number(pct), 100)}%` }}></div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="w-1/4 text-center">
                                                                            <span className={`px-3 py-1 text-xs font-semibold rounded-lg uppercase text-center w-fit 
                                                                            ${getStatusColor(
                                                                                kontrak
                                                                            )}`}>
                                                                                {kontrak.status}
                                                                            </span>
                                                                        </div>

                                                                        <div className="w-auto">
                                                                            <Link
                                                                                href={`/dashboard/rekap-gaji-karyawan/${user.id}?kontrak=${kontrak.id}&&project=${kontrak.projectId}`}
                                                                                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition cursor-pointer"
                                                                            >
                                                                                <Image
                                                                                    src={icons.viewLogo}
                                                                                    alt="View"
                                                                                    width={16}
                                                                                    height={16}
                                                                                />
                                                                                See Detail
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
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
                        totalItems={users.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={(page) => setCurrentPage(page)}
                        onItemsPerPageChange={(num) => setItemsPerPage(num)}
                    />
                </div>
            )}
        </div>
    );
};

export default RekapitulasiKinerjaShows;