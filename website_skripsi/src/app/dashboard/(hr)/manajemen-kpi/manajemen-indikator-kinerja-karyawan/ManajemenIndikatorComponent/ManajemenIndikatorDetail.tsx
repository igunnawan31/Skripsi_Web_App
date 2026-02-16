"use client";

import { useEffect, useMemo, useState } from "react";
import { IndikatorKPI, KategoriPertanyaanKPI, pertanyaanKPI,  } from "@/app/lib/types/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { useKpi } from "@/app/lib/hooks/kpi/useKpi";
import { SkalaNilai } from "@/app/lib/types/kpi/kpiTypes";
import QuestionShow from "../QuestionIndikatorComponent/QuestionShow";
import { useUser } from "@/app/lib/hooks/user/useUser";

export default function ManajemenIndikatorDetail({ id }: { id: string }) {
    const { data: fetchedData, isLoading, error } = useKpi().fetchIndicatorById(id);
    const { data: fetchedDataUser, isLoading: isLoadingUser, error: isErrorUser } = useUser().fetchAllUser();
    const router = useRouter();

    const groupedEvaluations = useMemo(() => {
        if (!fetchedData || !fetchedDataUser?.data) return [];

        const allUsers = fetchedDataUser.data;

        const map = fetchedData.evaluations.reduce((acc: any, curr: any) => {
            const evaluatorId = curr.evaluatorId;
            if (!acc[evaluatorId]) {
                acc[evaluatorId] = {
                    evaluatorId: evaluatorId,
                    evaluateeIds: []
                };
            }
            acc[evaluatorId].evaluateeIds.push(curr.evaluateeId);
            return acc;
        }, {});

        return Object.values(map);
    }, [fetchedData, fetchedDataUser]);

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         const found = KinerjaData.find((item) => item.id === id);
    //         setData(found || null);
    //         setLoading(false);
    //     }, 400);

    //     return () => clearTimeout(timer);
    // }, [id]);

    // useEffect(() => {
    //     const pertanyaan = setTimeout(() => {
    //         const foundPertanyaan = PertanyaanKPIData.filter((item) => item.IndikatorKPIId === id);
    //         setPertanyaanData(foundPertanyaan);
    //         setLoading(false);
    //     }, 400);

    //     return () => clearTimeout(pertanyaan);
    // }, []);

    if (isLoading) {
        return <div className="text-center text-(--color-muted)">Memuat data...</div>;
    }

    if (!error && !fetchedData) {
        return <div className="text-center text-red-500">Data tidak ditemukan.</div>;
    }

    return (
        <div className="flex flex-col gap-6 w-full pb-8">
            <button
                onClick={() => router.back()}
                className="w-fit px-3 py-2 bg-(--color-primary) hover:bg-red-800 flex flex-row gap-3 rounded-lg cursor-pointer transition"
            >
                <Image 
                    src={icons.arrowLeftActive}
                    alt="Back Arrow"
                    width={20}
                    height={20}
                />
                <p className="text-(--color-surface)">
                    Kembali ke halaman sebelumnya
                </p>
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-row gap-4 items-center">
                    <h1 className="text-2xl font-bold text-(--color-text-primary)">
                        Detail Indikator Kinerja Karyawan
                    </h1>
                </div>
                <span className="text-sm text-(--color-muted)">{fetchedData.id}</span>
            </div>

            <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                <form className="space-y-6">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Nama Indikator</label>
                        <input
                            type="text"
                            name="name"
                            value={fetchedData.name}
                            placeholder="Masukkan nama freelancer"
                            className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Deskripsi Indikator</label>
                        <input
                            type="text"
                            name="description"
                            value={fetchedData.description}
                            placeholder="Status Kerja"
                            className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                                name="startDate"
                                value={fetchedData.startDate ? fetchedData.startDate.substring(0, 10) : ""}
                                className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                disabled
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">
                                Periode Selesai
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={fetchedData.endDate ? fetchedData.endDate.substring(0, 10) : ""}
                                className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="mt-10 border-t border-gray-200 pt-6">
                        <h2 className="text-md font-semibold mb-4 text-(--color-textPrimary)">
                            Pengaturan Penilai dan Target
                        </h2>
                        
                        <div className="grid grid-cols-1 gap-4 mt-2">
                            {groupedEvaluations.length > 0 ? (
                                groupedEvaluations.map((item: any, index: number) => {
                                    const penilaiObj = fetchedDataUser?.data.find((u: any) => u.id === item.evaluatorId);
                                    
                                    return (
                                        <div key={item.evaluatorId} className="flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                            <div className="px-4 py-3 bg-gray-50 flex justify-between items-center border-b border-gray-200">
                                                <span className="font-semibold text-sm text-(--color-textPrimary)">
                                                    Kelompok Penilai #{index + 1}: {penilaiObj?.name}
                                                </span>
                                            </div>
                                            
                                            <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <p className="text-xs text-(--color-muted) font-medium tracking-wider">
                                                        Penilai (Orang yang Menilai)
                                                    </p>
                                                    <div className="text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-3 bg-white shadow-sm flex flex-col mt-3 border-l-4 border-l-yellow-500">
                                                        <span className="font-semibold">{penilaiObj?.name || "User tidak ditemukan"}</span>
                                                        <span className="text-xs text-gray-500">
                                                            {penilaiObj?.majorRole} — {penilaiObj?.minorRole}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-(--color-muted) font-medium tracking-wider">
                                                        Target yang Dinilai ({item.evaluateeIds.length})
                                                    </p>
                                                    <div className="space-y-2 mt-3">
                                                        {item.evaluateeIds.map((id: string) => {
                                                            const targetObj = fetchedDataUser?.data.find((u: any) => u.id === id);
                                                            return (
                                                                <div key={id} className="text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-3 bg-white shadow-sm flex flex-col border-l-4 border-l-blue-500">
                                                                    <span className="font-semibold">{targetObj?.name || "User tidak ditemukan"}</span>
                                                                    <span className="text-xs text-gray-500">
                                                                        {targetObj?.majorRole} — {targetObj?.minorRole}
                                                                    </span>
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
                                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 italic text-sm">
                                    Tidak ada data penilai dan target.
                                </div>
                            )}
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
                                    value={fetchedData.statusPublic}
                                    placeholder="Status Indikator"
                                    className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                                    value={fetchedData.status}
                                    placeholder="Status Indikator"
                                    className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Pilih status saat ini dari indikator KPI ini.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div>
                <h2 className="text-md font-semibold mb-4">Daftar Pertanyaan KPI</h2>
                <QuestionShow fetchedData={fetchedData.id} />
            </div>
        </div>
    );
}
