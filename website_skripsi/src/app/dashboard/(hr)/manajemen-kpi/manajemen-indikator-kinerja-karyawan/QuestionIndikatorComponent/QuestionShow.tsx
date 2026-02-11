"use client";

import FilterModal from "@/app/dashboard/dashboardComponents/allComponents/FilterModal";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import { icons } from "@/app/lib/assets/assets";
import { useKpi } from "@/app/lib/hooks/kpi/useKpi";
import { KategoriPertanyaanKPI, SkalaNilai } from "@/app/lib/types/kpi/kpiTypes";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface QuestionShowProps {
    fetchedData: string;
}

const QuestionShow = ({fetchedData}: QuestionShowProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [selectedKategori, setSelectedKategori] = useState<string>(searchParams.get("kategori") || "All");
    const [searchQuery, setSearchQuery] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const { data, isLoading, error} = useKpi().fetchAllQuestionByIdIndikator({
        id: fetchedData,
        kategori: selectedKategori !== "All" ? selectedKategori : undefined,
        searchTerm: searchQuery || undefined,
    });

    const questionData = data?.data || [];
    console.log(questionData);

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedKategori && selectedKategori !== "All") params.set("kategori", selectedKategori);
        if (searchQuery) params.set("searchTerm", searchQuery);
        router.replace(`?${params.toString()}`);
    }, [selectedKategori, searchQuery, router]);

    const handleApplyFilters = (filters: Record<string, string | undefined>) => {
        setSelectedKategori(filters.kategori || "All");
    };

    const filterFields = [
        { key: "kategori", label: "Kategori", type: "select" as const, options: Object.values(KategoriPertanyaanKPI) },
    ];
    
    const initialValues = {
        kategori: selectedKategori,
    };

    if (error) {
        return <div className="text-center text-red-500 py-6">Error: {error.message}</div>;
    };

    return (
        <div className="flex flex-col gap-4 w-full relative">
            <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-4">
                <SearchBar
                    placeholder="Cari indikator pertanyaan..."
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
                    {(selectedKategori !== "All" || searchQuery) && (
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
                            {selectedKategori !== "All" && (
                                <span
                                    className="flex items-center gap-2 bg-(--color-surface) border border-(--color-border) px-4 py-2 rounded-lg text-sm"
                                >
                                    Kategori: {selectedKategori}
                                    <button
                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                        onClick={() => setSelectedKategori("All")}
                                    >
                                        ✕
                                    </button>
                                </span>
                            )}
                        </>
                    )}
                </div>
                <form className="space-y-6">
                    <div className="flex flex-col">
                        <div className="space-y-4">
                            {questionData.map((p: any, i: any) => (
                                <div
                                    key={p.id}
                                    className="relative border border-gray-200 bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition"
                                >
                                    <div className="mb-3">
                                        <label className="text-sm font-medium text-gray-600">
                                            Pertanyaan #{i + 1}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Tulis pertanyaan..."
                                            value={p.pertanyaan}
                                            className="w-full bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            disabled
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">
                                                Bobot
                                            </label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={10}
                                                value={p.bobot}
                                                className="w-full bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                disabled
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-600">
                                                Kategori Pertanyaan
                                            </label>
                                            <input
                                                type="text"
                                                name="kategori"
                                                value={p.kategori}
                                                placeholder="Status Kerja"
                                                className="w-full bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="text-sm font-medium text-gray-600 mb-2 block">
                                            Preview Skala Penilaian
                                        </label>
                                        <div className="flex flex-wrap justify-between gap-4">
                                            {SkalaNilai.map((skala: any) => (
                                                <label
                                                    key={skala.nilai}
                                                    className="flex items-center gap-2"
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`skala-${p.id}`}
                                                        value={skala.nilai}
                                                        disabled
                                                        className="text-yellow-500 accent-yellow-500 w-5 h-5"
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                        {skala.nilai} - {skala.label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>
            </div>
            <FilterModal
                isOpen={isFilterOpen}
                filterFields={filterFields}
                initialValues={initialValues}
                onClose={() => setIsFilterOpen(false)}
                onApply={handleApplyFilters}
            />
        </div>
    )
}

export default QuestionShow;