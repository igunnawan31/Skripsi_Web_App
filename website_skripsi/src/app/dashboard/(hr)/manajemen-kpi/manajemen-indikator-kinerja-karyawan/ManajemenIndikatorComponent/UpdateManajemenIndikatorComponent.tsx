"use client";

import { icons } from "@/app/lib/assets/assets";
import { dummyUsers } from "@/app/lib/dummyData/dummyUsers";
import { KinerjaData } from "@/app/lib/dummyData/KinerjaData";
import { dummyProject } from "@/app/lib/dummyData/ProjectData";
import { IndikatorKPI, IndikatorKPIForm, KategoriPertanyaanKPI, layerPenilaian, pertanyaanKPI, StatusIndikatorKPI, StatusPublicKPI, User } from "@/app/lib/types/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateManajemenIndikatorComponent({id} : {id: string}) {
    const router = useRouter();
    const [data, setData] = useState<IndikatorKPI | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<IndikatorKPIForm>({
        namaIndikator: "",
        deskripsi: "",
        kategori: "",
        periodeMulai: "",
        periodeBerakhir: "",
        pertanyaan: [],
        hasilPenilaian: [],
        rekapPerUser: [],
        diisiOleh: [],
        pertanyaanUntuk: [],
        statusPublic: StatusPublicKPI.PUBLIC,
        status: StatusIndikatorKPI.AKTIF,
        dibuatOleh: dummyUsers[0],
        dibuatTanggal: "",
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            const found = KinerjaData.find((item) => item.id === id);
            setData(found || null);
            if (found) {
                setFormData({
                    namaIndikator: found.namaIndikator,
                    deskripsi: found.deskripsi,
                    kategori: found.kategori || "",
                    periodeMulai: found.periodeMulai,
                    periodeBerakhir: found.periodeBerakhir,
                    pertanyaan: found.pertanyaan,
                    hasilPenilaian: found.hasilPenilaian,
                    rekapPerUser: found.rekapPerUser,
                    diisiOleh: found.diisiOleh,
                    pertanyaanUntuk: found.pertanyaanUntuk,
                    statusPublic: found.statusPublic,
                    status: found.status,
                    dibuatOleh: found.dibuatOleh,
                    dibuatTanggal: found.dibuatTanggal,
                });
            }
            setLoading(false);
        }, 400);

        return () => clearTimeout(timer);
    }, [id]);

    const handleTambahPertanyaan = () => {
        const newQuestion: pertanyaanKPI = {
            id: crypto.randomUUID(),
            kategoriPertanyaan: KategoriPertanyaanKPI.KINERJA,
            pertanyaan: "",
            bobot: 1,
            aktif: true,
            IndikatorKPIId: "",
            skalaNilai: [
                { nilai: 1, label: "Sangat Tidak Baik" },
                { nilai: 2, label: "Tidak Baik" },
                { nilai: 3, label: "Cukup" },
                { nilai: 4, label: "Baik" },
                { nilai: 5, label: "Sangat Baik" },
            ],
            defaultRange: [1, 5],
        };

        setFormData({
            ...formData,
            pertanyaan: [...formData.pertanyaan, newQuestion],
        });
    };

    const handleHapusPertanyaan = (id: string) => {
        setFormData({
            ...formData,
            pertanyaan: formData.pertanyaan.filter((p) => p.id !== id),
        });
    };

    const handleEditPertanyaan = (id: string, field: string, value: any) => {
        setFormData({
            ...formData,
            pertanyaan: formData.pertanyaan.map((p) =>
                p.id === id ? { ...p, [field]: value } : p
            ),
        });
    };

    const filterUserByLayer = (penilai: User) => {
        const layer = layerPenilaian.find(
            (l) =>
                l.majorRolePenilai === penilai.majorRole &&
                (!l.minorRolePenilai || l.minorRolePenilai === penilai.minorRole)
        );
        if (!layer) return [];
        if (layer.hanyaDalamProject) {
            const projectsYangDiikuti = dummyProject.filter((project) =>
                project.anggotaProject?.some((member) => member.id === penilai.id)
            );
            const anggotaDariSemuaProject = projectsYangDiikuti.flatMap(
                (p) => p.anggotaProject ?? []
            );
            return anggotaDariSemuaProject.filter(
                (u): u is User =>
                    !!u.minorRole && layer.menilaiRole.includes(u.minorRole)
            );
        }
        return dummyUsers.filter(
            (u): u is User => !!u.minorRole && layer.menilaiRole.includes(u.minorRole)
        );
    };
    
    const renderHtml = (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-(--color-text-primary)">
                    Indikator Kinerja Karyawan
                </h1>
                <span className="text-sm text-(--color-muted)">ID: {data?.id}</span>
            </div>
            <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                <form className="space-y-6">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            Nama Indikator <span className="text-yellow-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="namaIndikator"
                            defaultValue={formData.namaIndikator}
                            placeholder="Masukkan nama Indikator"
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            Kategori Indikator
                        </label>
                        <select
                            value={formData.kategori}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    kategori: e.target.value as KategoriPertanyaanKPI,
                                })
                            }
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
                        >
                            {Object.values(KategoriPertanyaanKPI).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            Deskripsi Indikator
                        </label>
                        <textarea
                            name="deskripsi"
                            defaultValue={formData.deskripsi}
                            placeholder="Tuliskan deskripsi singkat indikator..."
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
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
                                defaultValue={formData.periodeMulai}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">
                                Periode Selesai
                            </label>
                            <input
                                type="date"
                                name="periodeBerakhir"
                                defaultValue={formData.periodeBerakhir}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-10 border-t border-gray-200 pt-6">
                        <h2 className="text-md font-semibold mb-4">Daftar Pertanyaan KPI</h2>
                        <div className="space-y-4">
                            {formData.pertanyaan.map((p, i) => (
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
                                            onChange={(e) =>
                                                handleEditPertanyaan(p.id, "pertanyaan", e.target.value)
                                            }
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-yellow-500"
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
                                                onChange={(e) =>
                                                    handleEditPertanyaan(
                                                        p.id,
                                                        "bobot",
                                                        parseFloat(e.target.value)
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-yellow-500"
                                            />
                                        </div>
    
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">
                                                Kategori Pertanyaan
                                            </label>
                                            <select
                                                value={p.kategoriPertanyaan}
                                                onChange={(e) =>
                                                    handleEditPertanyaan(
                                                        p.id,
                                                        "kategoriPertanyaan",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-yellow-500"
                                            >
                                                {Object.values(KategoriPertanyaanKPI).map((kategori) => (
                                                    <option key={kategori} value={kategori}>
                                                    {kategori}
                                                    </option>
                                                ))}
                                            </select>
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
                                            onClick={() => handleHapusPertanyaan(p.id)}
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
                            <div className="flex justify-center mt-6 w-full bg-(--color-tertiary)/30 rounded-lg p-20">
                                <button
                                    type="button"
                                    onClick={handleTambahPertanyaan}
                                    className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-medium cursor-pointer p-10 border-(--color-tertiary) border-2 rounded-lg bg-(--color-tertiary)/40"
                                >
                                    + Tambah Pertanyaan Baru
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 border-t border-gray-200 pt-6">
                        <h2 className="text-md font-semibold mb-4">Pengaturan Penilai dan Target</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-2">
                                    Diisi Oleh (Penilai)
                                </label>
                                <select
                                    value={formData.diisiOleh[0]?.id ?? ""}
                                    onChange={(e) => {
                                        const selectedUser = dummyUsers.find((u) => u.id === e.target.value);
                                        if (!selectedUser) return;
                                        const filtered = filterUserByLayer(selectedUser);
                                        setFormData({
                                            ...formData,
                                            diisiOleh: [selectedUser],
                                            pertanyaanUntuk: filtered,
                                        });
                                    }}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
                                >
                                    <option value="">-- Pilih Penilai --</option>
                                    {dummyUsers.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.nama} ({u.majorRole} - {u.minorRole})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Pilih siapa yang akan <b>memberikan penilaian</b>.
                                </p>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-2">
                                    Pertanyaan Untuk (Yang Dinilai)
                                </label>
                                <div className="border border-gray-300 rounded-lg p-3 min-h-20 bg-gray-50">
                                    {formData.pertanyaanUntuk.length > 0 ? (
                                        formData.pertanyaanUntuk.map((u) => (
                                            <div key={u.id} className="text-sm text-gray-700">
                                            {u.nama} ({u.minorRole})
                                            </div>
                                        ))
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
                                <select
                                    value={formData.statusPublic}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            statusPublic: e.target.value as StatusPublicKPI,
                                        })
                                    }
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
                                >
                                    {Object.values(StatusPublicKPI).map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Tentukan apakah indikator ini dapat dilihat publik.
                                </p>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-2">
                                    Status Indikator
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            status: e.target.value as StatusIndikatorKPI,
                                        })
                                    }
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
                                >
                                    <option value="">-- Pilih Status --</option>
                                    {Object.values(StatusIndikatorKPI).map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
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
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 active:scale-[0.98] transition"
                        >
                            <Image src={icons.saveLogo} alt="Save Logo" width={18} height={18} />
                            Simpan Indikator Kinerja Karyawan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return renderHtml;
}