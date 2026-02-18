"use client";

import React, { useEffect, useState } from "react";
import { IndikatorKPI, KategoriPertanyaanKPI, pertanyaanKPI,  } from "@/app/lib/types/types";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { PertanyaanKPIData } from "@/app/lib/dummyData/PertanyaanKPIData";
import { KinerjaData } from "@/app/lib/dummyData/KinerjaData";
import { dummyUsers } from "@/app/lib/dummyData/dummyUsers";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import { useKpi } from "@/app/lib/hooks/kpi/useKpi";
import { useUserLogin } from "@/app/context/UserContext";
import { useUser } from "@/app/lib/hooks/user/useUser";
import { StatusIndikatorKPI } from "@/app/lib/types/kpi/kpiTypes";
import { format } from "date-fns";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import FilterModal from "@/app/dashboard/dashboardComponents/allComponents/FilterModal";

export default function HasilKKDetail({ id }: { id: string }) {
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [selectedStatusNilai, setSelectedStatusNilai] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState("");

    const [openSummaryId, setOpenSummaryId] = useState<string | null>(null);
    const toggleSummary = (id: string) => {
        setOpenSummaryId(prevId => (prevId === id ? null : id));
    };
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const { data: fetchedDataIndicator, isLoading: isLoadingIndicator, error: isErrorIndicator} = useKpi().fetchIndicatorById(id);
    const { data: fetchedDataUser, isLoading: isLoadingUser, error: isErrorUser } = useUser().fetchAllUser();

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedStatusNilai && selectedStatusNilai !== "All") params.set("status", selectedStatusNilai);
        if (searchQuery) params.set("searchTerm", searchQuery);
        router.replace(`?${params.toString()}`);
    }, [selectedStatusNilai, searchQuery, router]);

    const handleApplyFilters = (filters: Record<string, string | undefined>) => {
        setSelectedStatusNilai(filters.statusNilai || "All");
        setCurrentPage(1);
    };

    const taskSummary = React.useMemo(() => {
        if (!fetchedDataIndicator || !fetchedDataUser) return [];

        const userMap = new Map();
        if (fetchedDataUser?.data) {
            fetchedDataUser.data.forEach((u: any) => {
                userMap.set(u.id, u.name);
            });
        }

        const evaluations = fetchedDataIndicator.evaluations || [];

        return evaluations.map((ev: any) => {
            const dataRekap = fetchedDataIndicator.rekap?.find(
                (r: any) => r.userId === ev.evaluateeId
            );

            const relatedJawaban = fetchedDataIndicator.jawaban || [];
            const lastSubmit = relatedJawaban.length > 0 
                ? relatedJawaban[relatedJawaban.length - 1].createdAt 
                : null;

            const sudahDinilai = (dataRekap?.jumlahPenilai || 0) > 0;

            return {
                idUnique: `${fetchedDataIndicator.id}-${ev.evaluateeId}`,
                indikatorId: fetchedDataIndicator.id,
                namaIndikator: fetchedDataIndicator.name,
                description: fetchedDataIndicator.description,
                startDate: fetchedDataIndicator.startDate,
                endDate: fetchedDataIndicator.endDate,
                indikatorPertanyaan: fetchedDataIndicator.pertanyaan?.length || 0,
                
                evaluateeId: ev.evaluateeId,
                namaTarget: userMap.get(ev.evaluateeId) || ev.evaluatee?.name || `Karyawan (${ev.evaluateeId.slice(0, 5)})`,
                
                sudahDinilai: sudahDinilai,
                totalNilai: dataRekap?.totalNilai || 0,
                rataRata: dataRekap?.rataRata || 0,
                jumlahPenilai: dataRekap?.jumlahPenilai || 0,
                disubmitPada: lastSubmit
            };
        });
    }, [fetchedDataIndicator, fetchedDataUser]);

    const tasksToDisplay = React.useMemo(() => {
        return taskSummary.filter((t: any) => {
            const matchName = t.namaTarget.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchStatus = 
                selectedStatusNilai === "All" ? true :
                selectedStatusNilai === "Sudah" ? t.sudahDinilai === true :
                selectedStatusNilai === "Belum" ? t.sudahDinilai === false : true;

            return matchName && matchStatus;
        });
    }, [taskSummary, searchQuery, selectedStatusNilai]);

    const totalItems = fetchedDataIndicator?.evaluations?.length || 0;

    const filterFields = [
        { key: "statusNilai", label: "Status Penilaian", type: "select" as const, options: ["Sudah", "Belum"]},
    ];
    
    const initialValues = {
        statusNilai: selectedStatusNilai,
    };

    if (isErrorIndicator || isErrorUser) {
        return <div className="text-center text-red-500 py-6">Error: {isErrorIndicator?.message ? isErrorIndicator.message : isErrorUser?.message}</div>;
    };

    const renderHtml = (
        <div className="flex flex-col gap-4 w-full relative">
            <button
                onClick={() => router.back()}
                className="w-fit px-3 py-2 bg-(--color-primary) hover:bg-red-800 flex flex-row gap-3 rounded-lg cursor-pointer transition"
            >
                <Image 
                    src={icons.arrowLeftActive}
                    alt="Back Arrow"
                    width={20}
                    height={20}
                />
                <p className="text-(--color-surface)">
                    Kembali ke halaman sebelumnya
                </p>
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-row gap-4 items-center">
                    <h1 className="text-2xl font-bold text-(--color-text-primary)">
                        Hasil Penilaian Indikator {fetchedDataIndicator?.name}
                    </h1>
                </div>
                <span className="text-sm text-(--color-muted) uppercase">ID: {fetchedDataIndicator?.id}</span>
            </div>
            <div className="w-full bg-white rounded-2xl shadow-sm p-4 border border-slate-200">
                <div className="flex flex-col gap-4">
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
                            {(searchQuery || selectedStatusNilai !== "All") && (
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
                                    {selectedStatusNilai !== "All" && (
                                        <span
                                            className="flex items-center gap-2 bg-(--color-surface) border border-(--color-border) px-4 py-2 rounded-lg text-sm"
                                        >
                                            Status Nilai: {selectedStatusNilai}
                                            <button
                                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                                onClick={() => setSelectedStatusNilai("All")}
                                            >
                                                ✕
                                            </button>
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    {isLoadingIndicator || isLoadingUser || !tasksToDisplay ? (
                        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: itemsPerPage }).map((_, i) => (
                                <div
                                    key={i}
                                    className="animate-pulse w-full bg-slate-200 h-48 rounded-xl"
                                ></div>
                            ))}
                        </div>
                    ) : tasksToDisplay.length > 0 ? (
                        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tasksToDisplay.map((task: any) => {
                                const isThisItemOpen = openSummaryId === task.idUnique;

                                return (
                                    <div
                                        key={task.idUnique}
                                        className="group bg-(--color-surface) border border-(--color-border) rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-sm font-semibold text-(--color-text-primary)">
                                                {task.namaTarget}
                                            </span>
                                            <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase ${
                                                task.sudahDinilai ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                            }`}>
                                                {task.sudahDinilai ? "Sudah Dinilai" : "Perlu Dinilai"}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-3 mb-6">
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-gray-800 line-clamp-1">{task.namaIndikator}</h3>
                                                <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:justify-between items-start">
                                                <div className="text-sm text-gray-500 flex gap-2 items-center justify-center">
                                                    <Image
                                                        src={icons.dateIn}
                                                        alt="Tanggal Mulai Cuti"
                                                        width={24}
                                                        height={24}
                                                    />
                                                    {task.startDate ? format(new Date(task.startDate), "dd MMM yyyy") : "-"}
                                                </div>
                                                <div className="text-sm text-gray-500 flex gap-2 items-center justify-center">
                                                    <Image
                                                        src={icons.dateOut}
                                                        alt="Tanggal Berakhir Cuti"
                                                        width={24}
                                                        height={24}
                                                    />
                                                    {task.endDate ? format(new Date(task.endDate), "dd MMM yyyy") : "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center ">
                                                <div className="text-sm text-gray-500 flex gap-2 items-center justify-center">
                                                    <Image
                                                        src={icons.question}
                                                        alt="Jumlah Pertanyaan Cuti"
                                                        width={24}
                                                        height={24}
                                                    />
                                                    {task.indikatorPertanyaan} Pertanyaan
                                                </div>
                                            </div>
                                        </div>

                                        {task.sudahDinilai ? (
                                            <button
                                                type="button"
                                                onClick={() => toggleSummary(task.idUnique)}
                                                className="flex justify-between items-center w-full cursor-pointer mb-4"
                                            >
                                                <span className="text-xs text-(--color-surface) px-3 py-2 bg-yellow-500 hover:bg-yellow-600 active:scale-[0.98] rounded-full">
                                                    Summary
                                                </span>
                                                <Image
                                                    src={icons.arrowData}
                                                    width={20}
                                                    height={20}
                                                    alt="Arrow Data"
                                                    className={`transition-transform duration-300 ${
                                                        isThisItemOpen ? "rotate-0" : "-rotate-90"
                                                    }`}
                                                />
                                            </button>
                                        ) : (
                                            <div className="text-center text-gray-400 italic text-sm">
                                                Belum ada summary, silahkan menghubungi evaluator untuk penilaian kpi ini.
                                            </div>
                                        )}

                                        {isThisItemOpen && (
                                            <>
                                                <div className="grid grid-cols-2 gap-2  bg-gray-50 rounded-xl border border-gray-100 mb-6">
                                                    <div className="flex flex-col p-3 items-center justify-center bg-gray-100 rounded-lg">
                                                        <span className="text-sm text-(--color-muted)">Rata-Rata</span>
                                                        <span className="text-lg font-bold text-(--color-primary)">
                                                            {task.sudahDinilai ? task.rataRata.toFixed(1) : "-"}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col p-3 items-center justify-center bg-gray-100 rounded-lg">
                                                        <span className="text-sm text-(--color-muted)">Total Nilai</span>
                                                        <span className="text-lg font-bold text-gray-800">
                                                            {task.sudahDinilai ? task.totalNilai : "-"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                                        <Image 
                                                            src={icons.question} 
                                                            alt="icon" 
                                                            width={24} 
                                                            height={24} 
                                                        />
                                                        <span>{task.indikatorPertanyaan} Indikator Dinilai</span>
                                                    </div>
                                                    {task.sudahDinilai && task.disubmitPada && (
                                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                                            <Image
                                                                src={icons.dateIn}
                                                                alt="Tanggal Mulai Cuti"
                                                                width={24}
                                                                height={24}
                                                            />
                                                            <span>Submit: {format(new Date(task.disubmitPada), "dd MMM yyyy, HH:mm")}</span>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            router.push(`/dashboard/manajemen-kpi/penilaian-kinerja-karyawan/${task.indikatorId}?evaluatee=${task.evaluateeId}`)
                                                        }}
                                                        className="mt-3 w-full py-2 rounded-lg text-sm font-semibold bg-(--color-success) text-white hover:bg-(--color-tertiary) hover:text-(--color-secondary) transition cursor-pointer"
                                                    >
                                                        <p>Lihat Detail Penilaian Karyawan</p>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-6">
                            Tidak ada data penilaian sesuai filter.
                        </p>
                    )}
                </div>
                {tasksToDisplay.length > 0 && (!isLoadingIndicator || isLoadingUser) && (
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
            </div>
            <FilterModal
                isOpen={isFilterOpen}
                filterFields={filterFields}
                initialValues={initialValues}
                onClose={() => setIsFilterOpen(false)}
                onApply={handleApplyFilters}
            />
        </div>
    )

    return renderHtml;
}