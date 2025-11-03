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

const KontrakKerjaShows = () => {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [kontrakKerja, setKontrakKerja] = useState<KontrakKerja[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get("status") || "All");

    const fetchData = async () => {
        setLoading(true);
        const result = await fetchKontrakKerja(
            currentPage,
            itemsPerPage,
            selectedStatus,
        );
        setKontrakKerja(result.data);
        setTotalItems(result.total);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, itemsPerPage, selectedStatus]);

    const renderHtml = (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="w-full flex-col md:flex-row items-center justify-between">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
                            <FilterBar
                                label="Filter by Status:"
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                                options={[
                                    { value: "All", label: "All Status" },
                                    { value: "Aktif", label: "Aktif" },
                                    { value: "Selesai", label: "Selesai" },
                                ]}
                            />
                        </div>

                        <div className="flex justify-start lg:justify-end w-full">
                            <Link
                                href="/dashboard/kontrak-kerja-karyawan/create"
                                className="w-full lg:w-auto flex items-center justify-center gap-2 px-4 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 active:scale-[0.98] transition-all text-sm font-medium shadow-sm"
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
            ) : kontrakKerja.length > 0 ? (
                <>
                    {kontrakKerja.map((kk) => (
                        <div
                            key={kk.id}
                            className="flex flex-col p-4 group bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                        >
                            <div className="flex justify-between items-center text-sm text-(--color-textPrimary) border-b border-(--color-border) py-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">Kontrak Kerja</span>
                                    <span className="text-(--color-muted)">{kk.id}</span>
                                    <p className="text-xs text-(--color-muted)">
                                        {kk.tanggalMulai} s.d {kk.tanggalSelesai}
                                    </p>
                                </div>
                                <div className="text-blue-900">
                                    {kk.status}
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <div className="flex flex-col gap-2 items-start">
                                    <p className="font-medium text-(--color-text-primary)">
                                        {kk.namaFreelance} — {kk.minorRole}
                                    </p>
                                    <p className="text-sm text-(--color-muted)">
                                        Project: {kk.project?.projectName}
                                    </p>
                                    <p className="text-sm font-medium px-4 py-2 bg-(--color-primary) rounded-lg text-(--color-surface)">
                                        Total: Rp {kk.totalBayaran.toLocaleString("id-ID")}
                                    </p>
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
                    Tidak ada data cuti sesuai filter.
                </p>
            )}

            {kontrakKerja.length > 0 && !loading && (
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

export default KontrakKerjaShows;
