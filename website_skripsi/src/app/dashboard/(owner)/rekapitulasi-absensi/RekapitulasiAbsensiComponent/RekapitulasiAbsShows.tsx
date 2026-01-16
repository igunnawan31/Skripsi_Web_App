"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import { useSearchParams, useRouter } from "next/navigation";
import { CutiRequestProps } from "@/app/props/HRProps/cutiProps";
import FilterModal from "@/app/dashboard/dashboardComponents/allComponents/FilterModal";
import { format, parseISO } from "date-fns";
import { icons } from "@/app/lib/assets/assets";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import Image from "next/image";
import { useReimburse } from "@/app/lib/hooks/reimburse/useReimburse";
import { ApprovalStatus } from "@/app/lib/types/reimburse/reimburseTypes";

const RekapitulasiAbsShows: React.FC<CutiRequestProps> = ({
    showButton = false,
    buttonText = "Aksi",
    onButtonClick,
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);

    const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get("approvalStatus") || "All");
    const [selectedMinDate, setSelectedMinDate] = useState<string>(searchParams.get("minSubmittedDate") || "");
    const [selectedMaxDate, setSelectedMaxDate] = useState<string>(searchParams.get("maxSubmittedDate") || "");
    const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("searchTerm") || "");

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const { data, isLoading, error } = useReimburse().fetchAllReimburse({
        page: currentPage,
        limit: itemsPerPage,
        approvalStatus: selectedStatus !== "All" ? selectedStatus : undefined,
        minSubmittedDate: selectedMinDate || undefined,
        maxSubmittedDate: selectedMaxDate || undefined,
        searchTerm: searchQuery || undefined,
    });

    const reimburse = data?.data || [];
    const totalItems = data?.meta?.total || 0;

    const getStatusColor = (ct: any) => {
        if (ct.approvalStatus === ApprovalStatus.PENDING) return "bg-yellow-100 text-yellow-800";
        if (ct.approvalStatus === ApprovalStatus.APPROVED) return "bg-green-100 text-green-800";
        if (ct.approvalStatus === ApprovalStatus.REJECTED) return "bg-red-100 text-red-800";
        return "bg-gray-200 text-gray-700";
    };

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedStatus && selectedStatus !== "All") params.set("approvalStatus", selectedStatus);
        if (selectedMinDate) params.set("minSubmittedDate", selectedMinDate);
        if (selectedMaxDate) params.set("maxSubmittedDate", selectedMaxDate);
        if (searchQuery) params.set("searchTerm", searchQuery);
        router.replace(`?${params.toString()}`);
    }, [selectedStatus, selectedMinDate, selectedMaxDate, searchQuery, router]);

    const handleApplyFilters = (filters: Record<string, string | undefined>) => {
        setSelectedMinDate(filters.minSubmittedDate || "");
        setSelectedMaxDate(filters.maxSubmittedDate || "");
        setSelectedStatus(filters.approvalStatus || "All");
        setCurrentPage(1);
    };

    const filterFields = [
        { key: "minSubmittedDate", label: "From", type: "date" as const },
        { key: "maxSubmittedDate", label: "To", type: "date" as const },
        { key: "approvalStatus", label: "Approval Status", type: "select" as const, options: Object.values(ApprovalStatus) },
    ];
    
    const initialValues = {
        minSubmittedDate: selectedMinDate,
        maxSubmittedDate: selectedMaxDate,
        approvalStatus: selectedStatus,
    };

    if (error) {
        return <div className="text-center text-red-500 py-6">Error: {error.message}</div>;
    }

    return (
        <div className="flex flex-col gap-4 w-full relative">
            <SearchBar
                placeholder="Cari karyawan..."
                onSearch={handleSearch}
            />
            

            {reimburse.length > 0 && !isLoading && (
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

export default RekapitulasiAbsShows;
