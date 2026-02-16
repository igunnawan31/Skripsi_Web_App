"use client";

import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { useEffect, useState } from "react";
import { KategoriPertanyaanKPI, QuestionCreateForm, SkalaNilai } from "@/app/lib/types/kpi/kpiTypes";
import toast from "react-hot-toast";
import { useQuestion } from "@/app/lib/hooks/kpi/useQuestion";

interface QuestionUpdateProps {
    questionId: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: QuestionCreateForm) => void;
    isPending: boolean;
}

const QuestionUpdateModal = ({
    questionId,
    isOpen,
    onClose,
    onSave,
    isPending,
}: QuestionUpdateProps) => {
    const { data: fetchedData, isLoading } = useQuestion().fetchIdQuestion(questionId);
    const [formData, setFormData] = useState<QuestionCreateForm>({
        kategori: KategoriPertanyaanKPI.KINERJA,
        pertanyaan: "",
        bobot: 1,
        aktif: true,
        urutanSoal: 0,
        indikatorId: "",
    });
    
    useEffect(() => {
        if (fetchedData) {
            setFormData({
                kategori: fetchedData.kategori ?? KategoriPertanyaanKPI.KINERJA,
                pertanyaan: fetchedData.pertanyaan ?? "",
                bobot: fetchedData.bobot ?? 0,
                aktif: fetchedData.aktif ?? true,
                urutanSoal: fetchedData.urutanSoal ?? 0,
                indikatorId: fetchedData.indikatorId ?? "",
            });
        }
    }, [fetchedData]);
    
    if (!isOpen) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "bobot" ? parseInt(value) || 0 : 
                    name === "aktif" ? value === "true" : value,
        }));
    };

    const handleLocalSave = () => {
        if (!formData.pertanyaan.trim()) {
            toast.error("Pertanyaan tidak boleh kosong");
            return;
        }
        onSave(formData); 
    };

    if (isLoading) {
        return <div className="text-center text-(--color-muted)">Memuat data...</div>;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-[80%] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800">Edit Pertanyaan</h3>
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

                <div className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Isi Pertanyaan</label>
                            <input
                                type="text"
                                name="pertanyaan"
                                value={formData.pertanyaan}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Bobot</label>
                                <input
                                    type="number"
                                    name="bobot"
                                    value={formData?.bobot}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Kategori</label>
                                <select
                                    value={formData?.kategori}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                                >
                                    {Object.values(KategoriPertanyaanKPI).map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Status</label>
                            <select
                                value={formData?.aktif ? "true" : "false"}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                            >
                                <option value="true">Aktif</option>
                                <option value="false">Non-Aktif</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">
                        Batal
                    </button>
                    <button 
                        onClick={handleLocalSave}
                        disabled={isPending || isLoading}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white transition
                            ${isPending
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-yellow-500 hover:bg-yellow-600 active:scale-[0.98]  cursor-pointer"
                            }`}
                    >
                        <Image src={icons.saveLogo} alt="Save Logo" width={18} height={18} />
                        {isPending ? "Menyimpan..." : "Update Pertanyaan"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionUpdateModal;