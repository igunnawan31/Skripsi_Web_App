"use client";

import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { User } from "@/app/lib/types/types";

interface EvalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    onEvaluatorChange: (userId: string) => void;
    potentialEvaluators: any[];
    groupedEvaluations: any[];
    getTargetEvaluatees: any; 
    formDataEval: any;
    fetchedDataUser: any;
    isPending: boolean;
    onRemoveItem: (evaluatorId: string) => void;
    onRemoveFromForm: (evaluatorId: string) => void;
    saveModalState: { isSuccess: boolean; isError: boolean; errorMessage: string };
    deleteModalState: { isSuccess: boolean; isError: boolean; errorMessage: string };
    onResetModalState: () => void;
}

const CreateEvalModal = ({
    isOpen,
    onClose,
    onSave,
    onEvaluatorChange,
    onRemoveItem,
    onRemoveFromForm,
    potentialEvaluators,
    groupedEvaluations,
    getTargetEvaluatees,
    formDataEval,
    fetchedDataUser,
    isPending,
    saveModalState,
    deleteModalState,
    onResetModalState,
}: EvalModalProps) => {
    if (!isOpen) return null;

    const existingEvaluatorIds = new Set(
        groupedEvaluations.map((g: any) => g.evaluatorId)
    );

    const existingEvals = formDataEval.evalMap.filter((item: any) => 
        existingEvaluatorIds.has(item.evaluatorId)
    );

    const newEvals = formDataEval.evalMap.filter((item: any) => 
        !existingEvaluatorIds.has(item.evaluatorId)
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-[80%] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800">Manajemen Penilai</h3>
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
                
                <div className="p-6 overflow-y-auto space-y-6">
                    {deleteModalState.isSuccess && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                            <span className="text-green-700 text-sm font-medium">Penilai berhasil dihapus</span>
                        </div>
                    )}
                    {deleteModalState.isError && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                            <span className="text-red-700 text-sm font-medium">{deleteModalState.errorMessage || "Gagal menghapus penilai"}</span>
                        </div>
                    )}
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
                        {existingEvals.length > 0 && (
                            <>
                                <p className="text-sm font-bold text-gray-700">
                                    Penilai Tersimpan ({existingEvals.length})
                                </p>
                                {existingEvals.map((item: any, index: any) => {
                                    const penilai = fetchedDataUser?.data?.find((u: any) => u.id === item.evaluatorId);
                                    return (
                                        <div key={item.evaluatorId} className="flex flex-col border border-yellow-200 rounded-xl overflow-hidden shadow-sm">
                                            <div className="px-4 py-2 flex justify-between items-center border-b border-yellow-200 bg-yellow-50">
                                                <span className="font-semibold text-sm text-(--color-textPrimary)">
                                                    Penilai #{index + 1}: {penilai?.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => onRemoveItem(item.evaluatorId)}
                                                    className="text-sm flex px-3 py-2 bg-(--color-primary) rounded-lg gap-2 cursor-pointer hover:bg-(--color-primary)/60"
                                                >
                                                    <Image src={icons.deleteLogo} alt="Delete" width={16} height={16} />
                                                    <span className="text-white">Hapus</span>
                                                </button>
                                            </div>
                                            <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-(--color-muted) font-medium tracking-wider">Penilai</p>
                                                    <div className="text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-3 bg-white shadow-sm flex flex-col mt-3 border-l-4 border-l-yellow-500">
                                                        <span className="font-semibold">{penilai?.name}</span>
                                                        <span className="text-xs">{penilai?.majorRole} — {penilai?.minorRole}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-(--color-muted) font-medium tracking-wider">
                                                        Target ({item.evaluateeId.length})
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
                                })}
                            </>
                        )}

                        {newEvals.length > 0 && (
                            <>
                                <p className="text-sm font-bold text-gray-700 mt-4">
                                    Penilai Baru (Belum Disimpan) ({newEvals.length})
                                </p>
                                {newEvals.map((item: any, index: any) => {
                                    const penilai = fetchedDataUser?.data?.find((u: any) => u.id === item.evaluatorId);
                                    return (
                                        <div key={item.evaluatorId} className="flex flex-col border border-green-200 rounded-xl overflow-hidden shadow-sm">
                                            <div className="px-4 py-2 flex justify-between items-center border-b border-green-200 bg-green-50">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">Baru</span>
                                                    <span className="font-semibold text-sm text-(--color-textPrimary)">
                                                        {penilai?.name}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => onRemoveFromForm(item.evaluatorId)}
                                                    className="text-sm flex px-3 py-2 bg-gray-400 rounded-lg gap-2 cursor-pointer hover:bg-gray-500"
                                                >
                                                    <Image src={icons.deleteLogo} alt="Delete" width={16} height={16} />
                                                    <span className="text-white">Batal</span>
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
                                                        Target penilai ({item.evaluateeId.length})
                                                    </p>
                                                    <div className="space-y-4 mt-3">
                                                        {getTargetEvaluatees(penilai).map((projectGroup: any) => {
                                                            const hasUsersInProject = projectGroup.users.length > 0;
                                                            
                                                            return (
                                                                <div key={projectGroup.projectId} 
                                                                    className={`rounded-lg p-3 border ${hasUsersInProject ? 'bg-gray-50 border-gray-100' : 'bg-red-50 border-red-200'}`}>
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className={`w-2 h-2 rounded-full ${hasUsersInProject ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                                                                            <span className="text-sm font-bold text-gray-600">
                                                                                Project: {projectGroup.projectName}
                                                                            </span>
                                                                        </div>
                                                                        {!hasUsersInProject && (
                                                                            <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full uppercase">
                                                                                Tidak Valid
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    {hasUsersInProject ? (
                                                                        <div className="space-y-2">
                                                                            {projectGroup.users.map((target: any) => (
                                                                                <div key={target.id} className="text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 bg-white shadow-sm flex flex-col border-l-4 border-l-blue-400">
                                                                                    <span className="text-sm font-semibold">{target.name}</span>
                                                                                    <span className="text- text-gray-500">{target.minorRole}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <p className="text-xs text-red-600 italic">
                                                                            Tidak ada anggota tim yang sesuai kriteria penilaian di project ini.
                                                                            Sehingga nantinya penilaian ini pada project ini tidak akan dianggap.
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}

                        {existingEvals.length === 0 && newEvals.length === 0 && (
                            <div className="text-center py-4 text-gray-400 text-sm italic">Belum ada penilai terpilih.</div>
                        )}
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
                    {saveModalState.isSuccess && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                            <span className="text-green-700 text-sm font-medium">✓ Penilai berhasil disimpan</span>
                        </div>
                    )}
                    {saveModalState.isError && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                            <span className="text-red-700 text-sm font-medium">✕ {saveModalState.errorMessage || "Terjadi kesalahan"}</span>
                        </div>
                    )}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                onResetModalState();
                                onClose();
                            }}
                            className="px-5 py-2 rounded-lg border border-(--color-border) text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            onClick={onSave}
                            disabled={isPending || saveModalState.isSuccess}
                            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white transition cursor-pointer
                                ${isPending || saveModalState.isSuccess
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-yellow-500 hover:bg-yellow-600 active:scale-[0.98]"
                                }`}
                        >
                            <Image src={icons.saveLogo} alt="Save Logo" width={18} height={18} />
                            {isPending ? "Menyimpan..." : saveModalState.isSuccess ? "Tersimpan ✓" : "Simpan Semua Perubahan"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEvalModal;