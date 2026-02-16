"use client";

import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { useState } from "react";
import { KategoriPertanyaanKPI, QuestionCreateForm, SkalaNilai } from "@/app/lib/types/kpi/kpiTypes";
import toast from "react-hot-toast";

interface QuestionCreateProps {
    indikatorId: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: QuestionCreateForm[]) => void;
    isPending: boolean;
    existingCount: number;
}

const QuestionCreateModal = ({
    indikatorId,
    isOpen,
    onClose,
    onSave,
    isPending,
    existingCount,
}: QuestionCreateProps) => {
    const [questions, setQuestions] = useState<QuestionCreateForm[]>([]);
    const newUrutan = existingCount + questions.length;

    if (!isOpen) return null;

    const handleTambahPertanyaan = () => {
        const newQuestion: QuestionCreateForm = {
            kategori: KategoriPertanyaanKPI.KINERJA,
            pertanyaan: "",
            bobot: 1,
            aktif: true,
            urutanSoal: newUrutan,
            indikatorId: indikatorId,
        };
        setQuestions([...questions, newQuestion]);
    };

    const handleEditPertanyaan = (index: number, field: keyof QuestionCreateForm, value: any) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
        setQuestions(updatedQuestions);
    };

    const handleHapusPertanyaan = (index: number) => {
        const filtered = questions.filter((_, i) => i !== index);
        const reordered = filtered.map((q, i) => ({
            ...q,
            urutanSoal: existingCount + i + 1
        }));
        setQuestions(reordered);
    };

    const handleLocalSave = () => {
        if (questions.length === 0) {
            toast.error("Tambahkan minimal satu pertanyaan");
            return;
        }
        onSave(questions); 
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-[80%] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800">Buat Pertanyaan Baru</h3>
                    <div
                        className="p-2 rounded-lg bg-(--color-primary) hover:bg-(--color-primary)/80 cursor-pointer transition"
                        onClick={onClose}
                    >
                        <Image
                            src={icons.closeMenu}
                            alt="Close Filter"
                            width={24}
                            height={24}
                        />
                    </div>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className="space-y-4">
                        {questions.map((p, index) => (
                            <div 
                                key={index} 
                                className="relative border border-gray-200 bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition"
                            >
                                <div className="mb-3">
                                    <label className="text-sm font-medium text-gray-600">Pertanyaan #{existingCount + index + 1}</label>
                                    <input
                                        type="text"
                                        placeholder="Tulis pertanyaan..."
                                        value={p.pertanyaan}
                                        onChange={(e) => handleEditPertanyaan(index, "pertanyaan", e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Bobot</label>
                                        <input
                                            type="number"
                                            value={p.bobot}
                                            onChange={(e) => handleEditPertanyaan(index, "bobot", parseInt(e.target.value))}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Kategori</label>
                                        <select
                                            value={p.kategori}
                                            onChange={(e) => handleEditPertanyaan(index, "kategori", e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                                        >
                                            {Object.values(KategoriPertanyaanKPI).map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Status Aktif</label>
                                        <select
                                            value={p.aktif ? "true" : "false"}
                                            onChange={(e) => handleEditPertanyaan(index, "aktif", e.target.value === "true")}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-yellow-500"
                                        >
                                            <option value="true">Aktif</option>
                                            <option value="false">Non-Aktif</option>
                                        </select>
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
                                                    name={`skala-${index}`}
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
                                <div className="w-full flex justify-end items-end mt-5">
                                    <button
                                        onClick={() => handleHapusPertanyaan(index)}
                                        className="text-sm flex px-3 py-2 bg-(--color-primary) rounded-lg gap-2 cursor-pointer hover:bg-(--color-primary)/60"
                                    >
                                        <Image
                                            src={icons.deleteLogo}
                                            alt="Delete Logo"
                                            width={16}
                                            height={16}
                                        />
                                        <span className="text-white">Hapus</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-center mt-6 w-full bg-(--color-tertiary)/30 rounded-lg p-20">
                            <button
                                onClick={handleTambahPertanyaan}
                                className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-medium cursor-pointer p-10 border-(--color-tertiary) border-2 rounded-lg bg-(--color-tertiary)/40"
                            >
                                + Tambah Baris Pertanyaan
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
                    <button
                        type="button" 
                        onClick={onClose} 
                        className="px-5 py-2 rounded-lg border border-(--color-border) text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                    >
                        Batal
                    </button>
                    <button 
                        type="button"
                        onClick={handleLocalSave}
                        disabled={isPending || questions.length === 0}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white transition
                            ${isPending || questions.length === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-yellow-500 hover:bg-yellow-600 active:scale-[0.98]  cursor-pointer"
                            }`}
                    >
                        <Image src={icons.saveLogo} alt="Save Logo" width={18} height={18} />
                        {isPending ? "Menyimpan..." : "Simpan Semua Pertanyaan"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionCreateModal;