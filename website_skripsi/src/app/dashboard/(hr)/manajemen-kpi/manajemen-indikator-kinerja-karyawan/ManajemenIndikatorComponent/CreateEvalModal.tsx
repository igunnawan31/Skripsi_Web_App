"use client";

import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";

interface EvalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    onEvaluatorChange: (userId: string) => void;
    potentialEvaluators: any[];
    groupedEvaluations: any[];
    formDataEval: any;
    fetchedDataUser: any;
    isPending: boolean;
    onRemoveItem: (evaluatorId: string) => void;
}

const CreateEvalModal = ({
    isOpen,
    onClose,
    onSave,
    onEvaluatorChange,
    onRemoveItem,
    potentialEvaluators,
    groupedEvaluations,
    formDataEval,
    fetchedDataUser,
    isPending
}: EvalModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800">Manajemen Penilai</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                            <label className="text-sm font-semibold text-gray-700">Tambah Penilai Baru</label>
                            <select
                                onChange={(e) => {
                                    onEvaluatorChange(e.target.value);
                                    e.target.value = "";
                                }}
                                className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-yellow-500"
                            >
                                <option value="">-- Pilih Penilai untuk Ditambahkan --</option>
                                {potentialEvaluators
                                    .filter((u: any) => !formDataEval.evalMap.some((e: any) => e.evaluatorId === u.id))
                                    .map((u: any) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} ({u.minorRole || u.majorRole})
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mt-2">
                        <p className="text-sm font-bold text-gray-700">Daftar Penilai ({formDataEval.evalMap.length})</p>
                        {formDataEval.evalMap.length > 0 ? (
                            formDataEval.evalMap.map((item: any, index: any) => {
                                const penilai = fetchedDataUser?.data?.find((u: any) => u.id === item.evaluatorId);
                                
                                return (
                                    <div key={item.evaluatorId} className="flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                        <div className="px-4 py-2 flex justify-between items-center border-b border-gray-200">
                                            <span className="font-semibold text-sm text-(--color-textPrimary)">
                                                Penilai #{index + 1}: {penilai?.name}
                                            </span>
                                            <button
                                                type="button" 
                                                onClick={() => onRemoveItem(item.evaluatorId)}
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

                                        <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-(--color-muted) font-medium tracking-wider">
                                                    Penilai (Orang yang Menilai)
                                                </p>
                                                <div className="text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-3 bg-white shadow-sm flex flex-col mt-3 border-l-4 border-l-yellow-500">
                                                    <span className="font-semibold">{penilai.name}</span>
                                                    <span className="text-xs">{penilai.majorRole} — {penilai.minorRole}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-(--color-muted) font-medium tracking-wider">
                                                    Target yang Dinilai ({item.evaluateeId.length})
                                                </p>
                                                <div className="space-y-2 mt-3">
                                                    {item.evaluateeId.map((id: any) => {
                                                        const targetObj = fetchedDataUser?.data.find((u: any) => u.id === id);
                                                        return (
                                                            <div key={id} className="text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-3 bg-white shadow-sm flex flex-col border-l-4 border-l-blue-500">
                                                                <span className="font-semibold">{targetObj?.name}</span>
                                                                <span className="text-xs">{targetObj?.majorRole} — {targetObj?.minorRole}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-4 text-gray-400 text-sm italic">Belum ada penilai terpilih.</div>
                        )}
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
                        onClick={onSave}
                        disabled={isPending}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white transition cursor-pointer
                            ${isPending
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-yellow-500 hover:bg-yellow-600 active:scale-[0.98]"
                            }`}
                    >
                        <Image src={icons.saveLogo} alt="Save Logo" width={18} height={18} />
                        {isPending ? "Menyimpan..." : "Simpan Semua Perubahan"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateEvalModal;