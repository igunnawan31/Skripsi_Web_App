"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import FilterBar from "@/app/dashboard/dashboardComponents/allComponents/FilterBar";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import { useKpi } from "@/app/lib/hooks/kpi/useKpi";
import { IndikatorResponse, StatusIndikatorKPI } from "@/app/lib/types/kpi/kpiTypes";
import FilterModal from "@/app/dashboard/dashboardComponents/allComponents/FilterModal";
import ConfirmationPopUpModal from "@/app/dashboard/dashboardComponents/allComponents/ConfirmationPopUpModal";
import toast from "react-hot-toast";
import CustomToast from "@/app/rootComponents/CustomToast";
import { format } from "date-fns";

const ManajemenIndikatorList = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [selectedIndikatorId, setSelectedIndikatorId] = useState<string | null>(null);
    const [selectedStatusPublic, setSelectedStatusPublic] = useState<string>(searchParams.get("statusPublic") || "All");
    const [selectedStatusIndikator, setSelectedStatusIndikator] = useState<string>(searchParams.get("status") || "All");
    const [selectedMinDate, setSelectedMinDate] = useState<string>(searchParams.get("minStartDate") || "");
    const [selectedMaxDate, setSelectedMaxDate] = useState<string>(searchParams.get("maxEndDate") || "");
    const [searchQuery, setSearchQuery] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const deleteIndikator = useKpi().deleteIndikator();
    const indikator = data?.data || [];
    const totalItems = data?.meta?.total || 0;

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedStatusPublic && selectedStatusPublic !== "All") params.set("statusPublic", selectedStatusPublic);
        if (selectedStatusIndikator && selectedStatusIndikator !== "All") params.set("status", selectedStatusIndikator);
        if (selectedMinDate) params.set("minStartDate", selectedMinDate);
        if (selectedMaxDate) params.set("maxEndDate", selectedMaxDate);
        if (searchQuery) params.set("searchTerm", searchQuery);
        router.replace(`?${params.toString()}`);
    }, [selectedStatusPublic, selectedStatusIndikator, selectedMinDate, selectedMaxDate, searchQuery, router]);

    const handleApplyFilters = (filters: Record<string, string | undefined>) => {
        setSelectedStatusPublic(filters.statusPublic || "All");
        setSelectedStatusIndikator(filters.status || "All");
        setSelectedMinDate(filters.minStartDate || "");
        setSelectedMaxDate(filters.maxEndDate || "");
        setCurrentPage(1);
    };

    const handleOpenModal = (id: string) => {
        setSelectedIndikatorId(id);
        setIsModalOpen(true);
    };

    const handleDelete = () => {
        if (!selectedIndikatorId) return;
        
        deleteIndikator.mutate(selectedIndikatorId, {
            onSuccess: () => {
                toast.custom(
                    <CustomToast
                        type="success"
                        message={"Indikator berhasil dihapus"}
                    />
                );
                setIsModalOpen(false);
                setSelectedIndikatorId("");
            },
            onError: (error) => {
                toast.custom(
                    <CustomToast
                        type="error"
                        message={error?.message || "Terjadi kendala ketika ingin menghapus indikator"}
                    />
                );
                setIsModalOpen(false);
                setSelectedIndikatorId("");
            }
        })
    }

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

    const filterFields = [
        { key: "minStartDate", label: "From", type: "date" as const },
        { key: "maxEndDate", label: "To", type: "date" as const },
        { key: "statusPublic", label: "Status Publik", type: "select" as const, options: ["true", "false"]},
        { key: "status", label: "Status Indikator", type: "select" as const, options: Object.values(StatusIndikatorKPI) },
    ];
    
    const initialValues = {
        minStartDate: selectedMinDate,
        maxEndDate: selectedMaxDate,
        statusPublic: selectedStatusPublic,
        status: selectedStatusIndikator,
    };

    if (error) {
        return <div className="text-center text-red-500 py-6">Error: {error.message}</div>;
    };

    const renderHtml = (
        <div className="flex flex-col gap-4 w-full relative">
            <SearchBar
                placeholder="Cari nama indikator KPI..."
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
                {(selectedStatusPublic !== "All" || selectedStatusIndikator !== "All" || selectedMinDate || selectedMaxDate || searchQuery) && (
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
                <div className="flex w-full">
                    <Link
                        href="/dashboard/manajemen-kpi/manajemen-indikator-kinerja-karyawan/create"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 active:scale-[0.98] transition-all text-sm font-medium shadow-sm"
                    >
                        <Image
                            src={icons.addLogo}
                            width={18}
                            height={18}
                            alt="Add Logo"
                            className="opacity-90"
                        />
                        Buat Indikator Penilaian Baru
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col gap-6">
                    {Array.from({ length: itemsPerPage }).map((_, i) => (
                        <div
                            key={i}
                            className="animate-pulse w-full bg-slate-200 h-48 rounded-xl"
                        ></div>
                    ))}
                </div>
            ) : indikator.length > 0 ? (
                <>
                    {indikator.map((ikk : IndikatorResponse) => (
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
                            <div className="flex justify-between items-center py-2">
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
                                    <p className="text-(--color-muted)">
                                        Dibuat oleh : {ikk.createdBy?.name}
                                    </p>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <Link
                                        href={`/dashboard/manajemen-kpi/manajemen-indikator-kinerja-karyawan/${ikk.id}`}
                                        className="flex items-center justify-center gap-2 p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer"
                                    >
                                        <Image
                                            src={icons.viewLogo}
                                            alt="View Logo"
                                            width={20}
                                            height={20}
                                        />
                                    </Link>

                                    <Link
                                        href={`/dashboard/manajemen-kpi/manajemen-indikator-kinerja-karyawan/${ikk.id}/update`}
                                        className="flex items-center gap-2 p-2 bg-(--color-secondary) text-white rounded-lg cursor-pointer"
                                    >
                                        <Image
                                            src={icons.editLogo}
                                            alt="Edit Logo"
                                            width={20}
                                            height={20}
                                        />
                                    </Link>
                                    <button
                                        onClick={() => handleOpenModal(ikk.id)}
                                        className="flex items-center justify-center gap-2 p-2 bg-(--color-primary) text-white rounded-lg hover:bg-(--color-primary)/80 cursor-pointer"
                                    >
                                        <Image
                                            src={icons.deleteLogo}
                                            alt="Delete Logo"
                                            width={20}
                                            height={20}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <p className="text-center text-gray-500 py-6">
                    Tidak ada data manajemen indikator sesuai filter.
                </p>
            )}

            {indikator.length > 0 && !isLoading && (
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
            <ConfirmationPopUpModal
                isOpen={isModalOpen}
                onAction={handleDelete}
                onClose={() => setIsModalOpen(false)}
                type="error"
                title={"Konfirmasi Hapus Indikator"}
                message={"Apakah Anda yakin ingin menghapus data indikator ini"}
                activeText="Ya"
                passiveText="Batal"
            />
        </div>
    );

    return renderHtml;
};

export default ManajemenIndikatorList;
