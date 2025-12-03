import { icons } from "@/app/lib/assets/assets";
import { dummySkalaNilai } from "@/app/lib/dummyData/PertanyaanKPIData";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
}: PenilaianKPIComponentProps) => {
    const router = useRouter();
    return (
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-2xl font-semibold text-gray-900">{judul}</h1>
            <p className="text-gray-600 mt-1">
                {sudahDinilai
                    ? "Berikut hasil penilaian indikator kinerja yang telah dilakukan."
                    : "Silahkan isi penilaian untuk setiap indikator yang tersedia."}
            </p>
            {categoriesQuestion.map(([kategori, list]) => (
                <div
                    key={kategori}
                >
                    <h2 className="text-lg font-semibold text-(--color-primary) mb-4">
                        {kategori}
                    </h2>

                    <div className="flex flex-col gap-6">
                        {list.map((item, index) => {
                            const readonlyValue = convertNilai.find(
                                (x) => x.pertanyaanId === item.id
                            );

                            return (
                                <div
                                    key={item.id}
                                    className="p-5 border border-gray-200 rounded-xl hover:border-(--color-primary) transition-all flex flex-col gap-4"
                                >
                                    <p className="text-gray-900 font-medium mb-3">
                                        {index + 1}. {item.pertanyaan}
                                    </p>
                                    {sudahDinilai ? (
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-4">
                                                {dummySkalaNilai.map((skala) => (
                                                    <span
                                                        key={skala.nilai}
                                                        className={`px-3 py-2 rounded-lg border text-sm ${
                                                            readonlyValue?.nilai === skala.nilai
                                                                ? "bg-(--color-tertiary) text-white border-(--color-tertiary)"
                                                                : "bg-gray-100 text-gray-600 border-gray-300"
                                                        }`}
                                                    >
                                                        {skala.nilai}
                                                    </span>
                                                ))}
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
                                                {dummySkalaNilai.map((skala) => (
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
                {sudahDinilai ? (
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-5 py-2 rounded-lg border border-(--color-border) text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                    >
                        Kembali
                    </button>                    
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-5 py-2 rounded-lg border border-(--color-border) text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            disabled={!allAnswered}
                            type="submit"
                            className="flex items-center gap-2 px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 active:scale-[0.98] transition cursor-pointer"
                        >
                            <Image src={icons.saveLogo} alt="Save Logo" width={18} height={18} />
                            Simpan Penilaian Kinerja Karyawan
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PenilaianIndikatorForm;
