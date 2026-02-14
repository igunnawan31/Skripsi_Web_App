"use client";

import ConfirmationPopUpModal from "@/app/dashboard/dashboardComponents/allComponents/ConfirmationPopUpModal";
import FilterModal from "@/app/dashboard/dashboardComponents/allComponents/FilterModal";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import { icons } from "@/app/lib/assets/assets";
import { useKpi } from "@/app/lib/hooks/kpi/useKpi";
import { useQuestion } from "@/app/lib/hooks/kpi/useQuestion";
import { KategoriPertanyaanKPI, QuestionCreateForm, SkalaNilai } from "@/app/lib/types/kpi/kpiTypes";
import CustomToast from "@/app/rootComponents/CustomToast";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import QuestionCreateModal from "./QuestionCreateModal";
import PaginationBar from "@/app/dashboard/dashboardComponents/allComponents/PaginationBar";
import QuestionUpdateModal from "./QuestionUpdateModal";

interface QuestionUpdateProps {
    fetchedData: string;
}

const QuestionUpdate = ({fetchedData}: QuestionUpdateProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
    const [selectedKategori, setSelectedKategori] = useState<string>(searchParams.get("kategori") || "All");
    const [searchQuery, setSearchQuery] = useState("");

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const { data, isLoading, error, refetch} = useKpi().fetchAllQuestionByIdIndikator({
        id: fetchedData,
        kategori: selectedKategori !== "All" ? selectedKategori : undefined,
        searchTerm: searchQuery || undefined,
    });
    const { mutate: createQuestions, isPending } = useQuestion().createQuestion();
    const { mutate: updateQuestion, isPending: isUpdatePending } = useQuestion().updateQuestion();

    const questionData = [...(data?.data || [])].sort((a, b) => a.urutanSoal - b.urutanSoal);
    const existingQuestionCount = questionData.length;
    const totalItems = data?.meta?.total || 0;
    const deleteQuestion = useQuestion().deleteQuestion();

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedKategori && selectedKategori !== "All") params.set("kategori", selectedKategori);
        if (searchQuery) params.set("searchTerm", searchQuery);
        router.replace(`?${params.toString()}`);
    }, [selectedKategori, searchQuery, router]);

    const handleApplyFilters = (filters: Record<string, string | undefined>) => {
        setSelectedKategori(filters.kategori || "All");
        setCurrentPage(1);
    };

    const handleEditModal = (id: string) => {
        setSelectedQuestionId(id);
        setIsEditModalOpen(true);
    }

    const handleSaveEdit = (updatedData: QuestionCreateForm) => {
        if (!selectedQuestionId) return;

        updateQuestion({ 
            id: selectedQuestionId, 
            questionData: updatedData 
        }, {
            onSuccess: async () => {
                toast.custom(<CustomToast type="success" message="Pertanyaan berhasil diperbarui" />);
                await refetch();
                setIsEditModalOpen(false);
            },
            onError: (err) => {
                toast.custom(<CustomToast type="error" message={err.message} />);
            }
        });
    };

    const handleOpenModal = (id: string) => {
        setSelectedQuestionId(id);
        setIsModalOpen(true);
    };

    const handleHapusPertanyaan = () => {
        if (!selectedQuestionId) return;
        
        deleteQuestion.mutate(selectedQuestionId, {
            onSuccess: async () => {
                toast.custom(
                    <CustomToast
                        type="success"
                        message={"Pertanyaan berhasil dihapus"}
                    />
                );

                await refetch();
                setIsModalOpen(false);
                setSelectedQuestionId("");
            },
            onError: (error) => {
                toast.custom(
                    <CustomToast
                        type="error"
                        message={error?.message || "Terjadi kendala ketika ingin menghapus pertanyaan"}
                    />
                );
                setIsModalOpen(false);
                setSelectedQuestionId("");
            }
        })
    };

    const handleOpenSimpanModal = () => {
        setIsCreateModalOpen(true);
    };

    const handleSimpanPertanyaan = (questionData: QuestionCreateForm[]) => {
        createQuestions(questionData, {
            onSuccess: async () => {
                toast.custom(
                    <CustomToast 
                        type="success" 
                        message="Pertanyaan berhasil dibuat" 
                    />
                );

                await refetch();
                setIsCreateModalOpen(false);
            },
            onError: (err) => {
                toast.custom(
                    <CustomToast 
                        type="error"
                        message={err.message} 
                    />
                );
                setIsCreateModalOpen(false);
            }
        });
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
                    placeholder="Cari pertanyaan indikator..."
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
                        <button
                            type="button"
                            onClick={handleOpenSimpanModal}
                            className="w-fit flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 active:scale-[0.98] transition-all text-sm font-medium shadow-sm cursor-pointer"
                        >
                            <Image
                                src={icons.addLogo}
                                width={18}
                                height={18}
                                alt="Add Logo"
                                className="opacity-90"
                            />
                            Buat Pertanyaan Baru
                        </button>
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
                {questionData.length > 0 ? (
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

                                        <div className="grid grid-cols-3 gap-4 mb-4">
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
                                                    placeholder="Kategori"
                                                    className="w-full bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                    disabled
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">
                                                    Status Aktif
                                                </label>
                                                <input
                                                    type="text"
                                                    name="aktif"
                                                    value={p.aktif}
                                                    placeholder="Status Pertanyaan"
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
                                        <div className="w-full flex justify-end items-end mt-5 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEditModal(p.id)}
                                                className="text-sm flex px-3 py-2 bg-(--color-secondary) rounded-lg gap-2 cursor-pointer hover:bg-(--color-secondary)/60"
                                            >
                                                <Image
                                                    src={icons.editLogo}
                                                    alt="Delete Logo"
                                                    width={16}
                                                    height={16}
                                                />
                                                <span className="text-white">
                                                    Edit
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleOpenModal(p.id)}
                                                className="text-sm flex px-3 py-2 bg-(--color-primary) rounded-lg gap-2 cursor-pointer hover:bg-(--color-primary)/60"
                                            >
                                                <Image
                                                    src={icons.deleteLogo}
                                                    alt="Delete Logo"
                                                    width={16}
                                                    height={16}
                                                />
                                                <span className="text-white">
                                                    Hapus
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>
                ) : (
                    <p className="text-center text-gray-500 py-6">
                        Belum ada daftar pertanyaan untuk indikator ini saat ini.
                    </p>
                )}
                {questionData.length > 0 && !isLoading && (
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
            <FilterModal
                isOpen={isFilterOpen}
                filterFields={filterFields}
                initialValues={initialValues}
                onClose={() => setIsFilterOpen(false)}
                onApply={handleApplyFilters}
            />
            <ConfirmationPopUpModal
                isOpen={isModalOpen}
                onAction={handleHapusPertanyaan}
                onClose={() => setIsModalOpen(false)}
                type="error"
                title={"Konfirmasi Hapus Pertanyaan"}
                message={"Apakah Anda yakin ingin menghapus data pertanyaan ini"}
                activeText="Ya"
                passiveText="Batal"
            />
            <QuestionUpdateModal
                questionId={selectedQuestionId || ""}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveEdit}
                isPending={isUpdatePending}
            />
            <QuestionCreateModal
                indikatorId={fetchedData}
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleSimpanPertanyaan}
                isPending={isPending}
                existingCount={existingQuestionCount}
            />
        </div>
    )
}

export default QuestionUpdate;