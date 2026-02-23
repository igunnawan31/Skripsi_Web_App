"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { icons, logo } from "@/app/lib/assets/assets";
import { KontrakKerjaStatus, MetodePembayaran } from "@/app/lib/types/types";
import { useKontrak } from "@/app/lib/hooks/kontrak/useKontrak";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import FilterModal from "@/app/dashboard/dashboardComponents/allComponents/FilterModal";
import ConfirmationPopUpModal from "@/app/dashboard/dashboardComponents/allComponents/ConfirmationPopUpModal";
import { KontrakResponse } from "@/app/lib/types/kontrak/kontrakTypes";
import { format } from "date-fns-tz";
import toast from "react-hot-toast";
import CustomToast from "@/app/rootComponents/CustomToast";

const KontrakKerjaShows = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    const [selectedKontrakId, setSelectedKontrakId] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get("status") || "All");
    const [selectedMinDate, setSelectedMinDate] = useState<string>(searchParams.get("minStartDate") || "");
    const [selectedMaxDate, setSelectedMaxDate] = useState<string>(searchParams.get("maxEndDate") || "");
    const [searchQuery, setSearchQuery] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const { data, isLoading, error} = useKontrak().fetchAllKontrak({
        page: currentPage,
        limit: itemsPerPage,
        status: selectedStatus !== "All" ? selectedStatus : undefined,
        minStartDate: selectedMinDate || undefined,
        maxEndDate: selectedMaxDate || undefined,
        searchTerm: searchQuery || undefined,
    });

    const deleteKontrak = useKontrak().deleteKontrak();

    const kontrak = data?.data || [];
    const totalItems = data?.meta?.total || 0;

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedStatus && selectedStatus !== "All") params.set("status", selectedStatus);
        if (selectedMinDate) params.set("minStartDate", selectedMinDate);
        if (selectedMaxDate) params.set("maxEndDate", selectedMaxDate);
        if (searchQuery) params.set("searchTerm", searchQuery);
        router.replace(`?${params.toString()}`);
    }, [selectedStatus, selectedMinDate, selectedMaxDate, searchQuery, router]);

    const handleApplyFilters = (filters: Record<string, string | undefined>) => {
        setSelectedStatus(filters.status || "All");
        setSelectedMinDate(filters.minStartDate || "");
        setSelectedMaxDate(filters.maxEndDate || "");
        setCurrentPage(1);
    };

    const handleOpenModal = (id: string) => {
        setSelectedKontrakId(id);
        setIsModalOpen(true);
    };

    const handleDelete = () => {
        if (!selectedKontrakId) return;
        
        deleteKontrak.mutate(selectedKontrakId, {
            onSuccess: () => {
                toast.custom(
                    <CustomToast
                        type="success"
                        message={"Kontrak berhasil dihapus"}
                    />
                );
                setIsModalOpen(false);
                setSelectedKontrakId("");
            },
            onError: (error) => {
                toast.custom(
                    <CustomToast
                        type="error"
                        message={error?.message || "Terjadi kendala ketika ingin menghapus kontrak"}
                    />
                );
                setIsModalOpen(false);
                setSelectedKontrakId("");
            }
        })
    }

    const getStatusColor = (ct: any) => {
        if (ct.status === KontrakKerjaStatus.ACTIVE) return "bg-yellow-100 text-yellow-800";
        if (ct.status === KontrakKerjaStatus.COMPLETED) return "bg-green-100 text-green-800";
        if (ct.status === KontrakKerjaStatus.ON_HOLD) return "bg-red-100 text-red-800";
        return "bg-gray-100 text-gray-700";
    };

    const filterFields = [
        { key: "minStartDate", label: "From", type: "date" as const },
        { key: "maxEndDate", label: "To", type: "date" as const },
        { key: "status", label: "Status", type: "select" as const, options: Object.values(KontrakKerjaStatus) },
    ];
    
    const initialValues = {
        minStartDate: selectedMinDate,
        maxEndDate: selectedMaxDate,
        status: selectedStatus,
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
                placeholder="Cari nama kontrak user..."
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
                {(selectedStatus !== "All" || selectedMinDate || selectedMaxDate || searchQuery) && (
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
                        href="/dashboard/kontrak-kerja-karyawan/create"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 active:scale-[0.98] transition-all text-sm font-medium shadow-sm"
                    >
                        <Image
                            src={icons.addLogo}
                            width={18}
                            height={18}
                            alt="Add Logo"
                            className="opacity-90"
                        />
                        Buat Kontrak Kerja Baru
                    </Link>
                </div>
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
            ) : kontrak.length > 0 ? (
                <>
                    {kontrak.map((kk: KontrakResponse) => (
                        <div
                            key={kk.id}
                            className="flex flex-col p-4 group bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                        >
                            <div className="flex justify-between items-center text-sm text-(--color-textPrimary) border-b border-(--color-border) py-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">Kontrak Kerja</span>
                                    <span className="text-(--color-muted)">{kk.id}</span>
                                </div>
                                <span
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg uppercase text-center w-fit 
                                    ${getStatusColor(
                                        kk
                                    )}`}
                                >
                                    {kk.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <div className="flex flex-col gap-2 items-start">
                                    <p className="font-medium text-(--color-text-primary)">
                                        {kk.user?.name} — {kk.user?.minorRole}
                                    </p>
                                    <p className="text-sm sm:text-xs border border-(--color-tertiary) hover:bg-(--color-tertiary) hover:text-white px-2.5 py-1 rounded-md whitespace-nowrap">
                                        Project: {kk.project?.name ? kk.project.name : "-"}
                                    </p>
                                    <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                                        <p className="text-sm font-medium px-4 py-2 bg-(--color-primary) rounded-lg text-(--color-surface)">
                                            Total: Rp {kk.totalBayaran.toLocaleString("id-ID")}
                                        </p>
                                        <div className="text-sm text-gray-500 flex gap-2 items-center justify-center">
                                            <Image
                                                src={icons.dateIn}
                                                alt="Tanggal Mulai Cuti"
                                                width={24}
                                                height={24}
                                            />
                                            {kk.startDate ? format(new Date(kk.startDate), "dd MMM yyyy") : "-"}
                                        </div>
                                        <div className="text-sm text-gray-500 flex gap-2 items-center justify-center">
                                            <Image
                                                src={icons.dateOut}
                                                alt="Tanggal Berakhir Cuti"
                                                width={24}
                                                height={24}
                                            />
                                            {kk.endDate ? format(new Date(kk.endDate), "dd MMM yyyy") : "-"}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <Link
                                        href={`/dashboard/kontrak-kerja-karyawan/${kk.id}`}
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
                                        href={`/dashboard/kontrak-kerja-karyawan/${kk.id}/update`}
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
                                        onClick={() => handleOpenModal(kk.id)}
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

            {kontrak.length > 10 && !isLoading && (
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
                title={"Konfirmasi Hapus Project"}
                message={"Apakah Anda yakin ingin menghapus data project ini"}
                activeText="Ya"
                passiveText="Batal"
            />
        </div>
    );

    return renderHtml;
};

export default KontrakKerjaShows;
