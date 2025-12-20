"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import FilterBar from "@/app/dashboard/dashboardComponents/allComponents/FilterBar";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { KontrakKerja, MajorRole, MinorRole, User } from "@/app/lib/types/types";
import { useUser } from "@/app/lib/hooks/user/useUser";
import toast from "react-hot-toast";
import CustomToast from "@/app/rootComponents/CustomToast";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import FilterModal from "@/app/dashboard/dashboardComponents/allComponents/FilterModal";
import ConfirmationPopUpModal from "@/app/dashboard/dashboardComponents/allComponents/ConfirmationPopUpModal";
import { useQueries } from "@tanstack/react-query";
import Cookies from "js-cookie";

const API = process.env.NEXT_PUBLIC_API_URL;

const MKShows = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedMinorRole, setSelectedMinorRole] = useState<string>(searchParams.get("minorRole") || "All");
    const [searchQuery, setSearchQuery] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const { data, isLoading, error } = useUser().fetchAllUser({
        page: currentPage,
        limit: itemsPerPage,
        majorRole: MajorRole.KARYAWAN,
        minorRole: selectedMinorRole !== "All" ? selectedMinorRole : undefined,
        searchTerm: searchQuery || undefined,
    });
    const deleteUser = useUser().DeleteUser();

    const user = data?.data || [];
    const projectIds: string[] = Array.from(
        new Set<string>(
            user.flatMap((u: any) =>
                (u.kontrak ?? []).map((k: any) => k.projectId as string)
            )
        )
    );
    const totalItems = data?.meta?.total || 0;

    const projectQueries = useQueries({
        queries: projectIds.map((projectId: string) => ({
            queryKey: ["project", projectId],
            queryFn: async (): Promise<User> => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const res = await fetch(`${API}/project/${projectId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch project");

                return res.json();
            },
            enabled: !!projectId,
            staleTime: 5 * 60 * 1000,
        })),
    });

    const projectMap = projectQueries.reduce<Record<string, string>>(
        (acc, q, index) => {
            if (q.data) {
                acc[projectIds[index]] = q.data.name;
            }
            return acc;
        },
        {}
    );

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedMinorRole && selectedMinorRole !== "All") params.set("minorRole", selectedMinorRole);
        if (searchQuery) params.set("searchTerm", searchQuery);
        router.replace(`?${params.toString()}`);
    }, [selectedMinorRole, searchQuery, router]);


    const handleApplyFilters = (filters: Record<string, string | undefined>) => {
        setSelectedMinorRole(filters.minorRole || "");
        setCurrentPage(1);
    };

    const handleOpenModal = (id: string) => {
        setSelectedUserId(id);
        setIsModalOpen(true);
    };

    const handleDelete = () => {
        if (!selectedUserId) return;

        deleteUser.mutate(selectedUserId, {
            onSuccess: () => {
                toast.custom(
                    <CustomToast 
                        type="success" 
                        message={"Project berhasil dihapus"} 
                    />
                );
                setIsModalOpen(false)
                setSelectedUserId("");
            },
            onError: (error) => {
                toast.custom(
                    <CustomToast 
                        type="error" 
                        message={error.message} 
                    />
                );
                setIsModalOpen(false);
                setSelectedUserId("");
            }
        })
    };

    const filterFields = [
        { key: "minorRole", label: "Role", type: "select" as const, options: Object.values(MinorRole) },
    ];
    
    const initialValues = {
        status: selectedMinorRole,
    };

    if (error) {
        return <div className="text-center text-red-500 py-6">Error: {error.message}</div>;
    }

    const renderHtml = (
        <div className="flex flex-col gap-4 w-full relative">
            <SearchBar
                placeholder="Cari nama karyawan"
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
                {(selectedMinorRole !== "All" || searchQuery) && (
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
                        {selectedMinorRole !== "All" && (
                            <span
                                className="flex items-center gap-2 bg-(--color-surface) border border-(--color-border) px-4 py-2 rounded-lg text-sm"
                            >
                                Status: {selectedMinorRole}
                                <button
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    onClick={() => setSelectedMinorRole("All")}
                                >
                                    ✕
                                </button>
                            </span>
                        )}
                    </>
                )}
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
            ) : user.length > 0 ? (
                <>
                    {user.map((usr: any) => (
                        <div
                            key={usr.id}
                            className="flex flex-col p-4 sm:p-5 lg:p-6
                                    group bg-(--color-surface) border border-(--color-border)
                                    rounded-2xl shadow-sm hover:shadow-md
                                    hover:-translate-y-1 transition-all duration-200"
                        >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center
                                            gap-1 text-xs sm:text-sm
                                            text-(--color-textPrimary)
                                            border-b border-(--color-border)
                                            pb-2">
                                <span className="text-(--color-muted) break-all">
                                    {usr.id}
                                </span>

                                <div className="text-blue-900 font-medium">
                                    {usr.minorRole}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 py-3">
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm sm:text-base font-semibold text-(--color-textPrimary) truncate max-w-[220px] sm:max-w-none">
                                        {usr.name}
                                    </p>
                                    <p className="text-xs sm:text-sm text-(--color-muted) break-all">
                                        {usr.email}
                                    </p>
                                    <div className="flex flex-wrap gap-2 my-1">
                                        {usr.kontrak?.length > 0 ? (
                                            usr.kontrak.map((k: any) => (
                                                <span
                                                    key={k.id}
                                                    className="text-[10px] sm:text-xs bg-(--color-tertiary) px-2.5 py-1 rounded-full whitespace-nowrap"
                                                >
                                                    {projectMap[k.projectId] ?? "Loading..."}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-xs text-gray-500">
                                                Tidak ada project
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-row items-center gap-2">
                                    <Link
                                        href={`/dashboard/manajemen-karyawan/${usr.id}`}
                                        className="flex items-center justify-center gap-2 p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer"
                                    >
                                        <Image
                                            src={icons.viewLogo}
                                            alt="View Logo"
                                            width={20}
                                            height={20}
                                        />
                                    </Link>
                                    <button
                                        onClick={() => handleOpenModal(usr.id)}
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
                    Tidak ada data karyawan sesuai filter.
                </p>
            )}

            {user.length > 0 && !isLoading && (
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

export default MKShows;
