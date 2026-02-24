import { icons } from "@/app/lib/assets/assets";
import { SkalaNilai } from "@/app/lib/types/kpi/kpiTypes";
import Image from "next/image";
import React from "react";

type PenilaianKPIComponentProps = {
    categoriesQuestion: [string, any[]][];
    convertNilai: any[];
    judul: string;
    sudahDinilai: boolean;
    formJawaban?: { [key: string]: { nilai: number | null; notes: string } };
    handleInputChange?: (id: string, nilai: number) => void;
    handleNotesChange?: (id: string, notes: string) => void;
    allAnswered?: boolean;
    onSubmit?: () => void;
};

const PenilaianIndikatorForm = ({
    categoriesQuestion,
    convertNilai,
    judul,
    sudahDinilai,
    formJawaban,
    handleInputChange,
    handleNotesChange,
    allAnswered,
    onSubmit
}: PenilaianKPIComponentProps) => {
    const totalPertanyaan = categoriesQuestion.reduce(
        (acc, [_, list]) => acc + list.length, 
        0
    );

    const totalTerjawab = sudahDinilai
        ? convertNilai.length
        : formJawaban 
            ? Object.values(formJawaban).filter(ans => ans.nilai !== null).length 
            : 0;

    const persentase = totalPertanyaan > 0 
        ? Math.round((totalTerjawab / totalPertanyaan) * 100) 
        : 0;

        return (
        <div className="w-full flex gap-6 pb-8">
            <div className="w-3/4 bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                <div className="gap-2">
                    <h1 className="text-2xl font-semibold text-gray-900">{judul}</h1>
                    <p className="text-gray-600 mt-1">
                        {sudahDinilai
                            ? "Berikut hasil penilaian indikator kinerja yang telah dilakukan."
                            : "Silahkan isi penilaian untuk setiap indikator yang tersedia."}
                    </p>
                </div>
                {categoriesQuestion.map(([kategori, list]) => (
                    <div
                        key={kategori}
                    >
                        <h2 className="text-lg font-semibold text-(--color-primary) mb-4">
                            {kategori}
                        </h2>

                        <div className="flex flex-col gap-6">
                            {list.map((item, index) => {
                                const readonlyValue = convertNilai?.find(
                                    (x: any) => x.pertanyaanId === item.id
                                );

                                const handleResetAnswer = (itemId: string) => {
                                    if (handleInputChange && handleNotesChange) {
                                        handleInputChange(itemId, null as any); 
                                        handleNotesChange(itemId, "");
                                    }
                                };

                                const currentAnswer = formJawaban?.[item.id];
                                const hasValue = currentAnswer && currentAnswer.nilai !== null;

                                return (
                                    <div
                                        key={item.id}
                                        className="p-5 border border-gray-200 rounded-xl hover:border-(--color-primary) transition-all flex flex-col gap-4"
                                    >
                                        <div className="flex justify-between">
                                            <p className="text-gray-900 font-medium mb-3">
                                                {index + 1}. {item.pertanyaan}
                                            </p>
                                            <p className="text-gray-900 font-medium mb-3">
                                                Bobot : {item.bobot}
                                            </p>
                                        </div>
                                        {!sudahDinilai && hasValue && (
                                            <button
                                                type="button"
                                                onClick={() => handleResetAnswer(item.id)}
                                                className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                                            >
                                                <span className="text-base">↺</span> Hapus Jawaban
                                            </button>
                                        )}
                                        {sudahDinilai ? (
                                            <div className="flex flex-col gap-3">
                                                <div className="flex flex-col md:flex-row justify-between md:items-center items-left">
                                                    <p>Sangat Buruk</p>
                                                    {SkalaNilai.map((skala) => (
                                                        <label
                                                            key={skala.nilai}
                                                            className="flex md:flex-col flex-row md:items-center items-left cursor-pointer gap-4 my-4"
                                                        >
                                                            <span
                                                                key={skala.nilai}
                                                                className={`w-5 h-5 rounded-full border text-sm ${
                                                                    readonlyValue?.nilai === skala.nilai
                                                                        ? "bg-(--color-tertiary) text-white border-(--color-tertiary)"
                                                                        : "bg-gray-100 text-gray-600 border-gray-300"
                                                                }`}
                                                            >
                                                            </span>
                                                            <span className="text-xs mt-1 text-gray-700">
                                                                {skala.nilai}
                                                            </span>
                                                        </label>
                                                    ))}
                                                    <p>Sangat Baik</p>
                                                </div>

                                                <div>
                                                    <p className="text-sm text-gray-600 font-semibold">
                                                        Catatan:
                                                    </p>
                                                    <p className="text-gray-900 mt-1">
                                                        {readonlyValue?.notes || "-"}
                                                    </p>
                                                </div>
                                            </div>

                                        ) : (
                                            <div className="flex flex-col gap-8">
                                                <div className="flex flex-col md:flex-row justify-between md:items-center items-left">
                                                    <p>Sangat Buruk</p>
                                                    {SkalaNilai.map((skala) => (
                                                        <label
                                                            key={skala.nilai}
                                                            className="flex md:flex-col flex-row md:items-center items-left cursor-pointer gap-4 my-4"
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={item.id}
                                                                value={skala.nilai}
                                                                onChange={() =>
                                                                    handleInputChange?.(
                                                                        item.id,
                                                                        skala.nilai
                                                                    )
                                                                }
                                                                className="w-5 h-5 text-(--color-primary) focus:ring-(--color-primary)"
                                                            />
                                                            <span className="text-xs mt-1 text-gray-700">
                                                                {skala.nilai}
                                                            </span>
                                                        </label>
                                                    ))}
                                                    <p>Sangat Baik</p>
                                                </div>

                                                <textarea
                                                    placeholder="Tambahkan catatan (opsional)"
                                                    value={formJawaban?.[item.id]?.notes || ""}
                                                    onChange={(e) =>
                                                        handleNotesChange?.(
                                                            item.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                    rows={3}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
                <div className="flex justify-end gap-4 pt-4">
                    {!sudahDinilai && (
                        <button
                            disabled={!allAnswered}
                            type="button"
                            onClick={onSubmit}
                            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white transition
                            ${!allAnswered
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-yellow-500 hover:bg-yellow-600 active:scale-[0.98]  cursor-pointer"
                            }`}
                        >
                            <Image src={icons.saveLogo} alt="Save Logo" width={18} height={18} />
                            Simpan Penilaian Kinerja Karyawan
                        </button>
                    )}
                </div>
            </div>
            <div className="w-1/4 h-fit sticky top-6 bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-gray-900">Ringkasan Progres</h3>
                    <p className="text-sm text-gray-500">Pantau pengisian penilaian Anda di sini.</p>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500" 
                            style={{ width: `${persentase}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 font-medium">Terjawab:</span>
                        <span className="font-bold text-gray-900">{totalTerjawab} / {totalPertanyaan}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 font-medium">Status:</span>
                        <span className={`font-bold ${persentase === 100 ? 'text-green-600' : 'text-orange-500'}`}>
                            {persentase === 100 ? 'Lengkap' : 'Belum Selesai'}
                        </span>
                    </div>
                </div>
                {sudahDinilai && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                        <p className="text-xs text-green-700 leading-relaxed">
                            Penilaian ini telah tersimpan secara permanen di sistem.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PenilaianIndikatorForm;
