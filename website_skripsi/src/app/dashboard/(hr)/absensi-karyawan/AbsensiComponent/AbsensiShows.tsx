"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import { Absensi } from "@/app/lib/types/types";
import { AbsensiRequestProps } from "@/app/props/HRProps/AbsensiProps";
import { fetchAbsensi } from "@/app/lib/hooks/dummyHooks/fetchAbsensi";
import { useSearchParams, useRouter } from "next/navigation";
import FilterBar from "@/app/dashboard/dashboardComponents/allComponents/FilterBar";

const AbsensiShows: React.FC<AbsensiRequestProps> = ({
    showButton = false,
    buttonText = "Aksi",
    onButtonClick,
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [absensi, setAbsensi] = useState<Absensi[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const today = new Date().toISOString().split("T")[0];
    const [selectedDate, setSelectedDate] = useState<string>(
        searchParams.get("date") || today
    );
    const [selectedRole, setSelectedRole] = useState<string>(
        searchParams.get("role") || "All"
    );

    const fetchData = async () => {
        setLoading(true);
        const result = await fetchAbsensi(
            currentPage,
            itemsPerPage,
            selectedDate,
            selectedRole
        );
        setAbsensi(result.data);
        setTotalItems(result.total);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, itemsPerPage, selectedDate, selectedRole]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedDate) params.set("date", selectedDate);
        if (selectedRole && selectedRole !== "All") params.set("role", selectedRole);
        router.replace(`?${params.toString()}`);
    }, [selectedDate, selectedRole, router]);

    const renderHtml = (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-(--color-text-secondary)">
                            Filter by Date:
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="border border-(--color-border) rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                        />
                    </div>
                    <FilterBar
                        label="Filter by Role:"
                        value={selectedRole}
                        onChange={setSelectedRole}
                        options={[
                            { value: "All", label: "All Roles" },
                            { value: "HR", label: "HR" },
                            { value: "Admin", label: "Admin" },
                            { value: "Project_Manager", label: "Project Manager" },
                            { value: "Freelance", label: "Freelance" },
                        ]}
                    />
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
            ) : absensi.length > 0 ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {absensi.map((abs) => (
                        <Link
                            key={abs.id}
                            href={`/dashboard/absensi-karyawan/${abs.id}`}
                            className="group bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                        >
                            <div className="p-5 flex flex-col gap-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-(--color-muted) font-medium truncate">
                                        {abs.id}
                                    </span>
                                    <span className="px-3 py-1 text-xs rounded-lg border border-(--color-border) bg-(--color-background) text-(--color-text-primary)">
                                        {abs.minorRole}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1 mt-2">
                                    <h2 className="font-semibold text-lg text-(--color-text-primary)">
                                        {abs.name}
                                    </h2>
                                    <p className="text-sm text-(--color-text-secondary)">
                                        {abs.workStatus}
                                    </p>
                                    <p className="text-sm text-(--color-text-secondary)">
                                        Date:{" "}
                                        <span className="font-medium text-(--color-text-primary)">
                                        {abs.date || "-"}
                                        </span>
                                    </p>
                                    <p className="text-sm text-(--color-text-secondary)">
                                        Time: {abs.checkIn} - {abs.checkOut}
                                    </p>
                                </div>

                                {showButton && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onButtonClick?.(abs.id);
                                            router.push(`/dashboard/absensi-karyawan/${abs.id}`);
                                        }}
                                        className="mt-3 w-full py-2 rounded-lg text-sm font-semibold bg-(--color-primary) text-white hover:bg-(--color-tertiary) hover:text-(--color-secondary) transition cursor-pointer"
                                    >
                                        {buttonText || "Absen Lebih Lanjut"}
                                    </button>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-6">
                    Tidak ada data absensi sesuai filter.
                </p>
            )}

            {absensi.length > 0 && !loading && (
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

export default AbsensiShows;
