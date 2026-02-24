"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import FilterBar from "@/app/dashboard/dashboardComponents/allComponents/FilterBar";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { icons, logo } from "@/app/lib/assets/assets";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import FilterModal from "@/app/dashboard/dashboardComponents/allComponents/FilterModal";
import { MinorRole } from "@/app/lib/types/enumTypes";
import { useKpi } from "@/app/lib/hooks/kpi/useKpi";
import { IndikatorResponse, StatusIndikatorKPI } from "@/app/lib/types/kpi/kpiTypes";
import { format } from "date-fns";
import { useJawaban } from "@/app/lib/hooks/kpi/useJawaban";

const HasilKKList = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [selectedProgress, setSelectedProgress] = useState<string>(searchParams.get("progress") || "All");
    const [selectedStatusPublic, setSelectedStatusPublic] = useState<string>(searchParams.get("statusPublic") || "All");
    const [selectedStatusIndikator, setSelectedStatusIndikator] = useState<string>(searchParams.get("status") || "All");
    const [selectedMinDate, setSelectedMinDate] = useState<string>(searchParams.get("minStartDate") || "");
    const [selectedMaxDate, setSelectedMaxDate] = useState<string>(searchParams.get("maxEndDate") || "");
    const [searchQuery, setSearchQuery] = useState("");

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const { data, isLoading, error} = useKpi().fetchAllIndikator({
        page: currentPage,
        limit: itemsPerPage,
        statusPublic: selectedStatusPublic === "All" ? undefined : selectedStatusPublic === "true",
        status: selectedStatusIndikator !== "All" ? selectedStatusIndikator : undefined,
        minStartDate: selectedMinDate || undefined,
        maxEndDate: selectedMaxDate || undefined,
        searchTerm: searchQuery || undefined,
    });
    const { data: allJawaban, isLoading: isLoadingJawaban, error: errorJawaban } = useJawaban().fetchAllJawaban({ limit: 1000 });

    const indikator = data?.data || [];
    const totalItems = data?.meta?.total || 0;

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedProgress && selectedProgress !== "All") params.set("progress", selectedProgress);
        if (selectedStatusPublic && selectedStatusPublic !== "All") params.set("statusPublic", selectedStatusPublic);
        if (selectedStatusIndikator && selectedStatusIndikator !== "All") params.set("status", selectedStatusIndikator);
        if (selectedMinDate) params.set("minStartDate", selectedMinDate);
        if (selectedMaxDate) params.set("maxEndDate", selectedMaxDate);
        if (searchQuery) params.set("searchTerm", searchQuery);
        router.replace(`?${params.toString()}`);
    }, [selectedProgress, selectedStatusPublic, selectedStatusIndikator, selectedMinDate, selectedMaxDate, searchQuery, router]);
    
    const handleApplyFilters = (filters: Record<string, string | undefined>) => {
        setSelectedStatusPublic(filters.statusPublic || "All");
        setSelectedStatusIndikator(filters.status || "All");
        setSelectedMinDate(filters.minStartDate || "");
        setSelectedMaxDate(filters.maxEndDate || "");
        setSelectedProgress(filters.progress || "All");
        setCurrentPage(1);
    };

    const getProgressStats = (ikk: IndikatorResponse) => {
        const totalEvaluatees = ikk.evaluations?.length || 0; 

        const answeredUniqueIds = new Set(
            allJawaban?.data
                ?.filter((j: any) => j.indikatorId === ikk.id)
                .map((j: any) => j.evaluateeId)
        );
        
        const totalTerjawab = answeredUniqueIds.size;
        const persentase = totalEvaluatees > 0 ? (totalTerjawab / totalEvaluatees) * 100 : 0;

        return { totalTerjawab, totalEvaluatees, persentase };
    };

    const getStatusColor = (ikk: IndikatorResponse) => {
        if (ikk.status === StatusIndikatorKPI.ACTIVE) return "bg-yellow-100 text-yellow-800";
        if (ikk.status === StatusIndikatorKPI.COMPLETED) return "bg-green-100 text-green-800";
        if (ikk.status === StatusIndikatorKPI.DRAFT) return "bg-red-100 text-red-800";
        return "bg-gray-100 text-gray-700";
    };

    const getStatusPublicColor = (ikk: IndikatorResponse) => {
        if (ikk.statusPublic === true) return "bg-green-100 text-green-800";
        if (ikk.statusPublic === false) return "bg-red-100 text-red-800";
        return "bg-gray-100 text-gray-700";
    };

    const filteredIndikator = useMemo(() => {
        if (!indikator) return [];
        
        return indikator.filter((ikk: IndikatorResponse) => {
            const { persentase } = getProgressStats(ikk);
            
            if (selectedProgress === "Lengkap") return persentase === 100;
            if (selectedProgress === "Belum Selesai") return persentase < 100;
            
            return true;
        });
    }, [indikator, selectedProgress, allJawaban]);

    const filterFields = [
        { key: "minStartDate", label: "From", type: "date" as const },
        { key: "maxEndDate", label: "To", type: "date" as const },
        { key: "statusPublic", label: "Status Publik", type: "select" as const, options: ["true", "false"]},
        { key: "status", label: "Status Indikator", type: "select" as const, options: Object.values(StatusIndikatorKPI) },
        { key: "progress", label: "Progres Penilaian", type: "select" as const, options: ["Lengkap", "Belum Selesai"] },
    ];
    
    const initialValues = {
        minStartDate: selectedMinDate,
        maxEndDate: selectedMaxDate,
        statusPublic: selectedStatusPublic,
        status: selectedStatusIndikator,
        progress: selectedProgress,
    };

    const getErrorMessage = () => {
        if (error?.message) return error.message;
        if (errorJawaban?.message) return errorJawaban.message;
        return "Terdapat kendala pada sistem";
    };

    const errorMessage = getErrorMessage();

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
                        {errorMessage}
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
                {(selectedProgress !== "All" || selectedStatusPublic !== "All" || selectedStatusIndikator !== "All" || selectedMinDate || selectedMaxDate || searchQuery) && (
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
                        {selectedStatusPublic !== "All" && (
                            <span
                                className="flex items-center gap-2 bg-(--color-surface) border border-(--color-border) px-4 py-2 rounded-lg text-sm"
                            >
                                Status Publik: {selectedStatusPublic === "true" ? "Aktif" : "Non-Aktif"}
                                <button
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    onClick={() => setSelectedStatusPublic("All")}
                                >
                                    ✕
                                </button>
                            </span>
                        )}
                        {selectedStatusIndikator !== "All" && (
                            <span
                                className="flex items-center gap-2 bg-(--color-surface) border border-(--color-border) px-4 py-2 rounded-lg text-sm"
                            >
                                Metode Pembayaran: {selectedStatusIndikator}
                                <button
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    onClick={() => setSelectedStatusIndikator("All")}
                                >
                                    ✕
                                </button>
                            </span>
                        )}
                        {selectedProgress !== "All" && (
                            <span className="flex items-center gap-2 bg-(--color-surface) border border-(--color-border) px-4 py-2 rounded-lg text-sm">
                                Progres: {selectedProgress}
                                <button
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    onClick={() => setSelectedProgress("All")}
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

            {isLoading || isLoadingJawaban ? (
                <div className="flex flex-col gap-6">
                    {Array.from({ length: itemsPerPage }).map((_, i) => (
                        <div
                            key={i}
                            className="animate-pulse w-full bg-slate-200 h-48 rounded-xl"
                        ></div>
                    ))}
                </div>
            ) : filteredIndikator.length > 0 ? (
                <>
                    {filteredIndikator.map((ikk: IndikatorResponse) => {
                        const { totalTerjawab, totalEvaluatees, persentase } = getProgressStats(ikk);

                        return (
                            <div
                                key={ikk.id}
                                className="flex flex-col p-4 group bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                            >
                                <div className="flex justify-between items-center text-sm text-(--color-textPrimary) border-b border-(--color-border) py-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{ikk.name}</span>
                                        <p className="text-xs text-(--color-muted)">
                                            {ikk.id}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-lg uppercase text-center w-fit 
                                            ${getStatusPublicColor(
                                                ikk
                                            )}`}
                                        >
                                            Status Publish : {String(ikk.statusPublic)}
                                        </span>
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-lg uppercase text-center w-fit 
                                            ${getStatusColor(
                                                ikk
                                            )}`}
                                        >
                                            Status Indikator : {ikk.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-2 mb-4">
                                    <div className="flex flex-col gap-2 items-start">
                                        <p className="font-medium text-(--color-text-primary)">
                                            {ikk.description}
                                        </p>
                                        <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-5">
                                            <div className="text-sm text-gray-500 flex gap-2 items-center justify-center">
                                                <Image
                                                    src={icons.dateIn}
                                                    alt="Tanggal Mulai Indikator"
                                                    width={24}
                                                    height={24}
                                                />
                                                {ikk.startDate ? format(new Date(ikk.startDate), "dd MMM yyyy") : "-"}
                                            </div>
                                            <div className="text-sm text-gray-500 flex gap-2 items-center justify-center">
                                                <Image
                                                    src={icons.dateOut}
                                                    alt="Tanggal Berakhir Indikator"
                                                    width={24}
                                                    height={24}
                                                />
                                                {ikk.endDate ? format(new Date(ikk.endDate), "dd MMM yyyy") : "-"}
                                            </div>
                                            <div className="text-sm text-gray-500 flex gap-2 items-center justify-center">
                                                <Image
                                                    src={icons.question}
                                                    alt="Jumlah Pertanyaan Cuti"
                                                    width={24}
                                                    height={24}
                                                />
                                                {ikk.pertanyaan?.length} Pertanyaan
                                            </div>
                                        </div>
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
                                <hr />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-gray-100 p-4 rounded-xl w-full mt-4">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-sm font-bold text-gray-900">Ringkasan Progres Penilaian</h3>
                                        <p className="text-xs text-gray-500">Karyawan yang sudah dinilai dalam periode ini.</p>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-yellow-500 h-2 rounded-full transition-all duration-500" 
                                                style={{ width: `${persentase}%` }}
                                            ></div>
                                        </div>

                                        <div className="flex justify-between items-center text-xs">
                                            <div className="flex gap-4">
                                                <span>
                                                    <span className="text-gray-600">Terjawab: </span>
                                                    <span className="font-bold text-gray-900">{totalTerjawab} / {totalEvaluatees}</span>
                                                </span>
                                                <span>
                                                    <span className="text-gray-600">Status: </span>
                                                    <span className={`font-bold ${persentase === 100 ? 'text-green-600' : 'text-orange-500'}`}>
                                                        {persentase === 100 ? 'Lengkap' : 'Belum Lengkap'}
                                                    </span>
                                                </span>
                                            </div>
                                            <span className="font-bold text-gray-900">{Math.round(persentase)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )})
                    }
                </>
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
                            Pencarian Tidak Ditemukan
                        </h1>
                        <span className="text-sm text-(--color-muted)">Ubah hasil pencarian kamu</span>
                    </div>
                </div>
            )}

            {filteredIndikator.length > 0 && !isLoading && (
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
