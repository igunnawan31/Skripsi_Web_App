"use client";

import React, { useEffect, useState } from "react";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import { useSearchParams, useRouter } from "next/navigation";
import { PenilaianProps } from "@/app/props/HRProps/PenilaianProps";
import { useUserLogin } from "@/app/context/UserContext";
import { useKpi } from "@/app/lib/hooks/kpi/useKpi";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import Image from "next/image";
import { icons, logo } from "@/app/lib/assets/assets";
import { StatusIndikatorKPI } from "@/app/lib/types/kpi/kpiTypes";
import FilterModal from "@/app/dashboard/dashboardComponents/allComponents/FilterModal";
import { useUser } from "@/app/lib/hooks/user/useUser";
import { format } from "date-fns";

const PenilaianIndikatorList: React.FC<PenilaianProps> = ({
    showButton = false,
    buttonText = "Aksi",
    onButtonClick,
}) => {
    const searchParams = useSearchParams();
    const user = useUserLogin();
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [assessmentStatus, setAssessmentStatus] = useState<string>(searchParams.get("assessmentStatus") || "All");
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
        minStartDate: selectedMinDate || undefined,
        maxEndDate: selectedMaxDate || undefined,
        searchTerm: searchQuery || undefined,
    });
    
    const { data: fetchedDataUser, isLoading: isLoadingUser } = useUser().fetchAllUser();

    useEffect(() => {
        const params = new URLSearchParams();
        if (assessmentStatus && assessmentStatus !== "All") params.set("assessmentStatus", assessmentStatus);
        if (selectedMinDate) params.set("minStartDate", selectedMinDate);
        if (selectedMaxDate) params.set("maxEndDate", selectedMaxDate);
        if (searchQuery) params.set("searchTerm", searchQuery);
        router.replace(`?${params.toString()}`);
    }, [assessmentStatus, selectedMinDate, selectedMaxDate, searchQuery, router]);

    const handleApplyFilters = (filters: Record<string, string | undefined>) => {
        setAssessmentStatus(filters.assessmentStatus || "All");
        setSelectedMinDate(filters.minStartDate || "");
        setSelectedMaxDate(filters.maxEndDate || "");
        setCurrentPage(1);
    };

    const tasksToReview = React.useMemo(() => {
        if (!data?.data || !user?.id) return [];

        const userMap = new Map();
        if (fetchedDataUser?.data) {
            fetchedDataUser.data.forEach((u: any) => {
                userMap.set(u.id, u.name);
            });
        }

        const allTasks = data.data
            .filter((indikator: any) => indikator.status === StatusIndikatorKPI.ACTIVE)
            .flatMap((indikator: any) => {
                const myEvaluations = indikator.evaluations?.filter(
                    (ev: any) => ev.evaluatorId === user?.id
                ) || [];

                return myEvaluations.map((ev: any) => {
                    const dataRekap = indikator.rekap?.find(
                        (r: any) => r.userId === ev.evaluateeId
                    );
                    const sudahDinilai = (dataRekap?.jumlahPenilai || 0) > 0;
                    
                    return {
                        idUnique: `${indikator.id}-${ev.evaluateeId}`,
                        indikatorId: indikator.id,
                        indikatorPertanyaan: indikator.pertanyaan.length,
                        namaIndikator: indikator.name,
                        description: indikator.description,
                        startDate: indikator.startDate,
                        endDate: indikator.endDate,
                        evaluateeId: ev.evaluateeId,
                        namaTarget: userMap.get(ev.evaluateeId) || ev.evaluatee?.name || "Karyawan",
                        sudahDinilai: sudahDinilai,
                    };
                });
            });

        if (assessmentStatus === "Sudah Dinilai") {
            return allTasks.filter((task: any) => task.sudahDinilai);
        } 
        if (assessmentStatus === "Perlu Dinilai") {
            return allTasks.filter((task: any) => !task.sudahDinilai);
        }

        return allTasks;
    }, [data, user?.id, fetchedDataUser, assessmentStatus]);

    const totalItems = tasksToReview.length || 0;
    
    const filterFields = [
        { key: "minStartDate", label: "From", type: "date" as const },
        { key: "maxEndDate", label: "To", type: "date" as const },
        { key: "assessmentStatus", label: "Status Penilaian", type: "select" as const, options: ["Perlu Dinilai", "Sudah Dinilai"] },
    ];
    
    const initialValues = {
        minStartDate: selectedMinDate,
        maxEndDate: selectedMaxDate,
        assessmentStatus: assessmentStatus

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
                placeholder="Cari nama karyawan yang dinilai..."
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
                {( assessmentStatus || selectedMinDate || selectedMaxDate || searchQuery) && (
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
                        {assessmentStatus !== "All" && (
                            <span
                                className="flex items-center gap-2 bg-(--color-surface) border border-(--color-border) px-4 py-2 rounded-lg text-sm"
                            >
                                Status Assesment: {assessmentStatus}
                                <button
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    onClick={() => setAssessmentStatus("All")}
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

            {isLoading || isLoadingUser ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: itemsPerPage }).map((_, i) => (
                        <div
                            key={i}
                            className="animate-pulse w-full bg-slate-200 h-48 rounded-xl"
                        ></div>
                    ))}
                </div>
            ) : tasksToReview.length > 0 ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasksToReview.map((task: any) => (
                        <div
                            key={task.idUnique}
                            className="group bg-(--color-surface) border border-(--color-border) rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-sm font-semibold text-(--color-text-primary)">
                                    {task.namaTarget}
                                </span>
                                <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase ${
                                    task.sudahDinilai ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}>
                                    {task.sudahDinilai ? "Sudah Dinilai" : "Belum Dinilai"}
                                </span>
                            </div>

                            <div className="space-y-1">
                                <h3 className="font-bold text-gray-800 line-clamp-1">Indikator - {task.namaIndikator}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
                            </div>

                            <div className="flex flex-col gap-3 mt-2">
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
                            </div>

                            <div className="flex justify-between items-center  mt-2">
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

                            {showButton && (
                                (!task.sudahDinilai) ? (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onButtonClick?.(task.idUnique);
                                            router.push(`/dashboard/manajemen-kpi/penilaian-kinerja-karyawan/${task.indikatorId}?evaluatee=${task.evaluateeId}`)
                                        }}
                                        className="mt-3 w-full py-2 rounded-lg text-sm font-semibold bg-(--color-primary) text-white hover:bg-(--color-tertiary) hover:text-(--color-secondary) transition cursor-pointer"
                                    >
                                        <p>{buttonText}</p>
                                    </button>
                                ): (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onButtonClick?.(task.idUnique);
                                            router.push(`/dashboard/manajemen-kpi/penilaian-kinerja-karyawan/${task.indikatorId}?evaluatee=${task.evaluateeId}`)
                                        }}
                                        className="mt-3 w-full py-2 rounded-lg text-sm font-semibold bg-(--color-success) text-white hover:bg-(--color-tertiary) hover:text-(--color-secondary) transition cursor-pointer"
                                    >
                                        <p>Lihat Detail Penilaian Karyawan</p>
                                    </button>
                                )
                            )}
                        </div>
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
                            Pencarian Tidak Ditemukan
                        </h1>
                        <span className="text-sm text-(--color-muted)">Ubah hasil pencarian kamu</span>
                    </div>
                </div>
            )}

            {tasksToReview.length > 0 && !isLoading && (
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

export default PenilaianIndikatorList;
