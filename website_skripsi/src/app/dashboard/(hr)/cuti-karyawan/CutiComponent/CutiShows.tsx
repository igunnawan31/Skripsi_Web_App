"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import { Cuti } from "@/app/lib/types/types";
import { fetchCuti } from "@/app/lib/hooks/dummyHooks/fetchCuti";
import { useSearchParams, useRouter } from "next/navigation";
import { CutiRequestProps } from "@/app/props/HRProps/cutiProps";

const CutiShows: React.FC<CutiRequestProps> = ({
    showButton = false,
    buttonText = "Aksi",
    onButtonClick,
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [cuti, setCuti] = useState<Cuti[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const today = new Date().toISOString().split("T")[0];
    const [selectedStatus, setSelectedStatus] = useState<string>(
        searchParams.get("status") || "All"
    );
    const [selectedRole, setSelectedRole] = useState<string>(
        searchParams.get("MajorRole") || "All"
    );

    const fetchData = async () => {
        setLoading(true);
        const result = await fetchCuti(
            currentPage,
            itemsPerPage,
            selectedStatus,
            selectedRole
        );
        setCuti(result.data);
        setTotalItems(result.total);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, itemsPerPage, selectedStatus, selectedRole]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedStatus) params.set("status", selectedStatus);
        if (selectedRole && selectedRole !== "All") params.set("role", selectedRole);
        router.replace(`?${params.toString()}`);
    }, [selectedStatus, selectedRole, router]);

    const renderHtml = (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-(--color-text-secondary)">
                            Filter by Status:
                        </label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="border border-(--color-border) rounded-md px-3 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                        >
                            <option value="All">All Status</option>
                            <option value="Menunggu">Menunggu</option>
                            <option value="Ditolak">Ditolak</option>
                            <option value="Diterima">Diterima</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-(--color-text-secondary)">
                            Filter by Role:
                        </label>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="border border-(--color-border) rounded-md px-3 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                        >
                            <option value="All">All Roles</option>
                            <option value="HR">HR</option>
                            <option value="Admin">Admin</option>
                            <option value="Project_Manager">Project Manager</option>
                            <option value="Freelance">Freelance</option>
                        </select>
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
            ) : cuti.length > 0 ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cuti.map((ct) => (
                        <Link
                            key={ct.id}
                            href={`/dashboard/cuti-karyawan/${ct.id}`}
                            className="group bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                        >
                            <div className="p-5 flex flex-col gap-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-(--color-muted) font-medium truncate">
                                        {ct.id}
                                    </span>
                                    <span className="px-3 py-1 text-xs rounded-lg border border-(--color-border) bg-(--color-background) text-(--color-text-primary)">
                                        {ct.minorRole}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1 mt-2">
                                    <h2 className="font-semibold text-lg text-(--color-text-primary)">
                                        {ct.name}
                                    </h2>
                                    <p className="text-sm text-(--color-text-secondary)">
                                        Alasan : {ct.reason}
                                    </p>
                                    <p className="text-sm text-(--color-text-secondary)">
                                        Date:{" "}
                                        <span className="font-medium text-(--color-text-primary)">
                                        {ct.startDate || "-"} s.d {ct.endDate}
                                        </span>
                                    </p>
                                    {/* <p className="text-sm text-(--color-text-secondary)">
                                        Time: {abs.checkIn} - {abs.checkOut}
                                    </p> */}
                                </div>

                                {showButton && (
                                    <button
                                        onClick={(e) => {
                                        e.preventDefault();
                                            onButtonClick?.(ct.id);
                                        }}
                                        className="mt-3 w-full py-2 rounded-lg text-sm font-semibold bg-(--color-primary) text-white hover:bg-(--color-tertiary) hover:text-(--color-secondary) transition"
                                    >
                                        {buttonText || "Cuti Lebih Lanjut"}
                                    </button>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-6">
                    Tidak ada data cuti sesuai filter.
                </p>
            )}

            {cuti.length > 0 && !loading && (
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

export default CutiShows;
