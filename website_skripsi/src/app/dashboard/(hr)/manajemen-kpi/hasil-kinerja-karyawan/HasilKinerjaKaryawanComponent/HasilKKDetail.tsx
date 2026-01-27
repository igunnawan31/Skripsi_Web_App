"use client";

import { useEffect, useState } from "react";
import { IndikatorKPI, KategoriPertanyaanKPI, pertanyaanKPI,  } from "@/app/lib/types/types";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { PertanyaanKPIData } from "@/app/lib/dummyData/PertanyaanKPIData";
import { KinerjaData } from "@/app/lib/dummyData/KinerjaData";
import { dummyUsers } from "@/app/lib/dummyData/dummyUsers";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";

export default function HasilKKDetail({ id }: { id: string }) {
    const [data, setData] = useState<IndikatorKPI | null>(null);
    const [pertanyaanData, setPertanyaanData] = useState<pertanyaanKPI[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("searchTerm") || "");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            const found = KinerjaData.find((item) => item.id === id);
            setData(found || null);
            setLoading(false);
        }, 400);

        return () => clearTimeout(timer);
    }, [id]);

    useEffect(() => {
        const pertanyaan = setTimeout(() => {
            const foundPertanyaan = PertanyaanKPIData.filter((item) => item.IndikatorKPIId === id);
            setPertanyaanData(foundPertanyaan);
            setLoading(false);
        }, 400);

        return () => clearTimeout(pertanyaan);
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const renderHtml = (
        loading ? (
            <>
                <div className="animate-pulse w-full bg-slate-100 h-fit rounded-xl p-4 gap-6">
                    <div className="animate-pulse w-full bg-slate-200 h-14 rounded-xl mb-6" />
                    <div className="animate-pulse w-24 bg-slate-200 h-10 rounded-xl mb-6" />
                    <div className="flex flex-col gap-6">
                        {Array.from({ length: itemsPerPage }).map((_, i) => (
                            <div
                                key={i}
                                className="animate-pulse w-full bg-slate-200 h-48 rounded-xl"
                            ></div>
                        ))}
                    </div>
                </div>
            </>
        ) : (
            <div className="flex flex-col gap-4 w-full">
                <button
                    onClick={() => router.back()}
                    className="w-fit px-3 py-2 bg-(--color-primary) hover:bg-red-800 flex flex-row gap-3 rounded-lg cursor-pointer transition"
                >
                    <Image 
                        src={icons.arrowLeftActive}
                        alt="Back Arrow"
                        width={20}
                        height={20}
                    />
                    <p className="text-(--color-surface)">
                        Kembali ke halaman sebelumnya
                    </p>
                </button>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-row gap-4 items-center">
                        <h1 className="text-2xl font-bold text-(--color-text-primary)">
                            Detail {data?.namaIndikator}
                        </h1>
                    </div>
                    <span className="text-sm text-(--color-muted) uppercase">ID: {data?.id}</span>
                </div>
                <div className="w-full bg-white rounded-2xl shadow-sm p-4 border border-slate-200">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 w-full relative">
                            <SearchBar
                                placeholder="Cari karyawan..."
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    )

    return renderHtml;
}