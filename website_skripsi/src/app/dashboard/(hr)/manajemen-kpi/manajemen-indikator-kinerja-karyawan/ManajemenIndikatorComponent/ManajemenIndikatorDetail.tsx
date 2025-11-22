"use client";

import { useEffect, useState } from "react";
import { IndikatorKPI, KategoriPertanyaanKPI, pertanyaanKPI,  } from "@/app/lib/types/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { PertanyaanKPIData } from "@/app/lib/dummyData/PertanyaanKPIData";
import { KinerjaData } from "@/app/lib/dummyData/KinerjaData";
import { dummyUsers } from "@/app/lib/dummyData/dummyUsers";

export default function ManajemenIndikatorDetail({ id }: { id: string }) {
    const [data, setData] = useState<IndikatorKPI | null>(null);
    const [pertanyaanData, setPertanyaanData] = useState<pertanyaanKPI[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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

    if (loading) {
        return <div className="text-center text-(--color-muted)">Memuat data...</div>;
    }

    if (!data) {
        return <div className="text-center text-red-500">Data tidak ditemukan.</div>;
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-(--color-text-primary)">
                    Indikator Kinerja Karyawan
                </h1>
                <span className="text-sm text-(--color-muted)">ID: {data.id}</span>
            </div>

            <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                <form className="space-y-6">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Nama Indikator</label>
                        <input
                            type="text"
                            name="namaIndikator"
                            value={data.namaIndikator}
                            placeholder="Masukkan nama freelancer"
                            className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled
                        />
                    </div>
    
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Kategori Indikator</label>
                        <input
                            type="text"
                            name="kategori"
                            value={data.kategori}
                            placeholder="Masukkan nama project"
                            className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Deskripsi Indikator</label>
                        <input
                            type="text"
                            name="workStatus"
                            value={data.kategori}
                            placeholder="Status Kerja"
                            className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled
                        />
                    </div>
    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">
                                Periode Mulai
                            </label>
                            <input
                                type="date"
                                name="periodeMulai"
                                value={data.periodeMulai}
                                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                disabled
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">
                                Periode Selesai
                            </label>
                            <input
                                type="date"
                                name="periodeSelesai"
                                value={data.periodeBerakhir}
                                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="mt-10 border-t border-gray-200 pt-6">
                        <h2 className="text-md font-semibold mb-4">Daftar Pertanyaan KPI</h2>
                        <div className="space-y-4">
                            {pertanyaanData.map((p, i) => (
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
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-yellow-500"
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
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-yellow-500"
                                                disabled
                                            />
                                        </div>
    
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">
                                                Kategori Pertanyaan
                                            </label>
                                            <input
                                                type="text"
                                                name="workStatus"
                                                value={p.kategoriPertanyaan}
                                                placeholder="Status Kerja"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-yellow-500"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="text-sm font-medium text-gray-600 mb-2 block">
                                            Preview Skala Penilaian
                                        </label>
                                        <div className="flex flex-wrap gap-4">
                                            {p.skalaNilai.map((skala) => (
                                                <label
                                                    key={skala.nilai}
                                                    className="flex items-center gap-2"
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`skala-${p.id}`}
                                                        value={skala.nilai}
                                                        disabled
                                                        className="text-yellow-500 accent-yellow-500"
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
                                            type="button"
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

                    <div className="mt-10 border-t border-gray-200 pt-6">
                        <h2 className="text-md font-semibold mb-4">Pengaturan Penilai dan Target</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-2">
                                    Diisi Oleh (Penilai)
                                </label>
                                {Array.isArray(data.diisiOleh) && data.diisiOleh.length > 0 ? (
                                    <div className="space-y-1">
                                        {data.diisiOleh.map((u) => (
                                            <div key={u.id} className="text-sm text-gray-700 border border-gray-200 rounded px-3 py-2 bg-white">
                                                {u.nama} {u.minorRole ? `(${u.minorRole})` : ""}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">Belum ada penilai yang ditentukan.</p>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-2">
                                    Pertanyaan Untuk (Yang Dinilai)
                                </label>
                                <div className="border border-gray-300 rounded-lg p-3 min-h-20 bg-gray-50">
                                    {Array.isArray(data.pertanyaanUntuk) && data.pertanyaanUntuk.length > 0 ? (
                                        <div className="space-y-1">
                                            {data.pertanyaanUntuk.map((u) => (
                                                <div key={u.id} className="text-sm text-gray-700 border border-gray-200 rounded px-3 py-2 bg-white">
                                                    {u.nama} {u.minorRole ? `(${u.minorRole})` : ""}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">
                                            Belum ada karyawan yang bisa dinilai.
                                        </p>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Sistem otomatis memilih siapa saja yang dapat dinilai oleh penilai
                                    berdasarkan <b>layer penilaian</b>.
                                </p>
                            </div>
                        </div>
                    </div>
    
                    <div className="mt-10 border-t border-gray-200 pt-6">
                        <h2 className="text-md font-semibold mb-4">Pengaturan Tampilan</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-2">
                                    Status Publish
                                </label>
                                <input
                                    type="text"
                                    name="statusPublic"
                                    value={data.statusPublic}
                                    placeholder="Status Indikator"
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Tentukan apakah indikator ini dapat dilihat publik.
                                </p>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-2">
                                    Status Indikator
                                </label>
                                <input
                                    type="text"
                                    name="status"
                                    value={data.status}
                                    placeholder="Status Indikator"
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Pilih status saat ini dari indikator KPI ini.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-5 py-2 rounded-lg border border-(--color-border) text-gray-700 hover:bg-gray-100 transition"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
