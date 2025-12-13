"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import FilterBar from "@/app/dashboard/dashboardComponents/allComponents/FilterBar";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { KontrakKerja } from "@/app/lib/types/types";
import { fetchKontrakKerja } from "@/app/lib/hooks/dummyHooks/fetchKontrakKerja";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import { useProject } from "@/app/lib/hooks/project/useProject";
import FilterModal from "@/app/dashboard/dashboardComponents/allComponents/FilterModal";
import { format } from "date-fns";
import { ProjectStatus } from "@/app/lib/types/fixTypes";
import ConfirmationPopUpModal from "@/app/dashboard/dashboardComponents/allComponents/ConfirmationPopUpModal";
import toast from "react-hot-toast";
import CustomToast from "@/app/rootComponents/CustomToast";

const ProjectShows = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
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
    
    const { data, isLoading, error } = useProject().fetchAllProject({
        page: currentPage,
        limit: itemsPerPage,
        status: selectedStatus !== "All" ? selectedStatus : undefined,
        minStartDate: selectedMinDate || undefined,
        maxEndDate: selectedMaxDate || undefined,
        searchTerm: searchQuery || undefined,
    });
    const deleteProject = useProject().DeleteProject();

    const project = data?.data || [];
    const totalItems = data?.meta?.total || 0;

    const getStatusColor = (ct: any) => {
        if (ct.status === ProjectStatus.ACTIVE) return "bg-yellow-100 text-yellow-800";
        if (ct.status === ProjectStatus.COMPLETED) return "bg-green-100 text-green-800";
        if (ct.status === ProjectStatus.ON_HOLD) return "bg-red-100 text-red-800";
        return "bg-gray-100 text-gray-700";
    };

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedStatus && selectedStatus !== "All") params.set("status", selectedStatus);
        if (selectedMinDate) params.set("minStartDate", selectedMinDate);
        if (selectedMaxDate) params.set("maxEndDate", selectedMaxDate);
        if (searchQuery) params.set("searchTerm", searchQuery);
        router.replace(`?${params.toString()}`);
    }, [selectedStatus, selectedMinDate, selectedMaxDate, searchQuery, router]);

    const handleApplyFilters = (filters: Record<string, string | undefined>) => {
        setSelectedMinDate(filters.minStartDate || "");
        setSelectedMaxDate(filters.maxEndDate || "");
        setSelectedStatus(filters.status || "All");
        setCurrentPage(1);
    };

    const handleOpenModal = (id: string) => {
        setSelectedProjectId(id);
        setIsModalOpen(true);
    }

    const handleDelete = () => {
        if (!selectedProjectId) return;

        deleteProject.mutate(selectedProjectId, {
            onSuccess: () => {
                toast.custom(
                    <CustomToast 
                        type="success" 
                        message={"Project berhasil dihapus"} 
                    />
                );
                setIsModalOpen(false)
                setSelectedProjectId("");
            },
            onError: (error) => {
                toast.custom(
                    <CustomToast 
                        type="error" 
                        message={error.message} 
                    />
                );
                setIsModalOpen(false);
                setSelectedProjectId("");
            }
        })
    }

    const filterFields = [
        { key: "minStartDate", label: "From", type: "date" as const },
        { key: "maxEndDate", label: "To", type: "date" as const },
        { key: "status", label: "Status", type: "select" as const, options: Object.values(ProjectStatus) },
    ];
    
    const initialValues = {
        minStartDate: selectedMinDate,
        maxEndDate: selectedMaxDate,
        status: selectedStatus,
    };

    if (error) {
        return <div className="text-center text-red-500 py-6">Error: {error.message}</div>;
    }

    const renderHtml = (
        <div className="flex flex-col gap-4 w-full relative">
            <SearchBar
                placeholder="Cari nama project..."
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
                        href="/dashboard/manajemen-project/create"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 active:scale-[0.98] transition-all text-sm font-medium shadow-sm"
                    >
                        <Image
                            src={icons.addLogo}
                            width={18}
                            height={18}
                            alt="Add Logo"
                            className="opacity-90"
                        />
                        Buat Project Baru
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col p-4 gap-6">
                    {Array.from({ length: itemsPerPage }).map((_, i) => (
                        <div
                            key={i}
                            className="animate-pulse w-full bg-slate-200 h-48 rounded-xl"
                        ></div>
                    ))}
                </div>
            ) : project.length > 0 ? (
                <>
                    {project.map((pr: any) => (
                        <div
                            key={pr.id}
                            className="flex flex-col p-4 group bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                        >
                            <div className="flex justify-between items-center text-sm text-(--color-textPrimary) border-b border-(--color-border) py-2">
                                <span className="text-(--color-muted)">{pr.id}</span>
                                <span
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg uppercase text-center w-fit 
                                    ${getStatusColor(
                                        pr
                                    )}`}
                                >
                                    {pr.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <div className="flex flex-col gap-2 items-start">
                                    <h2 className="font-semibold text-lg text-(--color-textPrimary)">{pr.name}</h2>
                                    <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4">
                                        <div className="text-sm text-gray-500 flex gap-2 items-center justify-center">
                                            <Image
                                                src={icons.dateIn}
                                                alt="Tanggal Mulai Cuti"
                                                width={24}
                                                height={24}
                                            />
                                            {pr.startDate ? format(new Date(pr.startDate), "dd MMM yyyy") : "-"}
                                        </div>
                                        <div className="text-sm text-gray-500 flex gap-2 items-center justify-center">
                                            <Image
                                                src={icons.dateOut}
                                                alt="Tanggal Berakhir Cuti"
                                                width={24}
                                                height={24}
                                            />
                                            {pr.endDate ? format(new Date(pr.endDate), "dd MMM yyyy") : "-"}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <Link
                                        href={`/dashboard/manajemen-project/${pr.id}`}
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
                                        href={`/dashboard/manajemen-project/${pr.id}/update`}
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
                                        onClick={() => handleOpenModal(pr.id)}
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
                    Tidak ada data project sesuai filter.
                </p>
            )}

            {project.length > 0 && !isLoading && (
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

export default ProjectShows;
