"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import FilterBar from "@/app/dashboard/dashboardComponents/allComponents/FilterBar";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { KontrakKerja, MinorRole, User } from "@/app/lib/types/types";
import { fetchKontrakKerja } from "@/app/lib/hooks/dummyHooks/fetchKontrakKerja";
import { fetchUsers } from "@/app/lib/hooks/dummyHooks/fetchUsers";

const MKShows = () => {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedMinorRole, setSelectedMinorRole] = useState<string>(searchParams.get("minorRole") || "All");

    const fetchData = async () => {
        setLoading(true);
        const result = await fetchUsers(
            currentPage,
            itemsPerPage,
            selectedMinorRole,
        );
        setUsers(result.data);
        setTotalItems(result.total);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, itemsPerPage, selectedMinorRole]);

    const renderHtml = (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="w-full flex-col md:flex-row items-center justify-between">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
                            <FilterBar
                                label="Filter by Status:"
                                value={selectedMinorRole}
                                onChange={setSelectedMinorRole}
                                options={[
                                    {value: "All", label: "All Roles"},
                                    ...Object.values(MinorRole).map(item => ({
                                        value: item,
                                        label: item.charAt(0).toUpperCase() + item.slice(1)
                                    }))
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: itemsPerPage }).map((_, i) => (
                        <div
                            key={i}
                            className="animate-pulse w-full bg-slate-200 h-48 rounded-xl"
                        ></div>
                    ))}
                </div>
            ) : users.length > 0 ? (
                <>
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="flex flex-col p-4 group bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                        >
                            <div className="flex justify-between items-center text-sm text-(--color-textPrimary) border-b border-(--color-border) py-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-(--color-textPrimary) font-semibold">{user.id}</span>
                                    <p className="text-xs text-(--color-muted)">
                                        {user.tanggalMulai} s.d {user.tanggalSelesai}
                                    </p>
                                </div>
                                <div className="text-blue-900">
                                    {user.minorRole}
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <div className="flex flex-col gap-2 py-2">
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <p className="text-(--color-textPrimary) font-semibold">{user.nama}</p>
                                        <p className="text-(--color-muted) text-sm">{user.email}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {user.projectList.length > 0 ? (
                                            user.projectList.map((item) => (
                                                <span
                                                    key={item.projectId}
                                                    className="text-xs bg-(--color-tertiary) text-(--color-textPrimary) px-3 py-1 rounded-full"
                                                >
                                                    {item.projectName}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-center text-gray-500">
                                                Tidak ada project.
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <Link
                                        href={`/dashboard/manajemen-karyawan/${user.id}`}
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
                                        href={`/dashboard/manajemen-karyawan/${user.id}/update`}
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
                                        // onClick={() => handleDelete(kk.id)}
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

            {users.length > 0 && !loading && (
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
    );

    return renderHtml;
};

export default MKShows;
