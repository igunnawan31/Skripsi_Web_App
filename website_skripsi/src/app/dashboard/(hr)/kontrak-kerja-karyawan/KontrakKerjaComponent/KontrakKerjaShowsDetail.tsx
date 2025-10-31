"use client";

import { useEffect, useState } from "react";
import { KontrakKerja } from "@/app/lib/types/types";
import { dummyKontrakKerja } from "@/app/lib/dummyData/KontrakKerjaData";

export default function KontrakKerjaDetail({ id }: { id: string }) {
    const [data, setData] = useState<KontrakKerja | null>(null);
    const [loading, setLoading] = useState(true);
    const [monthlyPercentages, setMonthlyPercentages] = useState<number[]>([]);
    const [monthlyPresence, setMonthlyPresence] = useState<{ bulan: string; absensi: number; cuti: number }[]>([]);

    const getMonthDifference = (startDate: string, endDate: string): number => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const years = end.getFullYear() - start.getFullYear();
        const months = end.getMonth() - start.getMonth();
        return years * 12 + months + 1;
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            const found = dummyKontrakKerja.find((item) => item.id === id);
            setData(found || null);
            setLoading(false);
        }, 400);

        return () => clearTimeout(timer);
    }, [id]);

    useEffect(() => {
        if (!data?.tanggalMulai || !data.tanggalSelesai) return;

        const start = new Date(data.tanggalMulai);
        const end = new Date(data.tanggalSelesai);
        const cuti = Number(data.cutiBulanan ?? 0);

        const months: { bulan: string; absensi: number; cuti: number }[] = [];

        let current = new Date(start);

        while (current <= end) {
            const year = current.getFullYear();
            const month = current.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const startDay = (year === start.getFullYear() && month === start.getMonth()) ? start.getDate() : 1;
            const endDay = (year === end.getFullYear() && month === end.getMonth()) ? end.getDate() : daysInMonth;

            const totalDays = endDay - startDay + 1;
            const absensi = Math.max(totalDays - cuti, 0);

            const bulanNama = current.toLocaleString("id-ID", { month: "long", year: "numeric" });
            months.push({
                bulan: bulanNama,
                absensi,
                cuti
            });

            current = new Date(year, month + 1, 1);
        }

        setMonthlyPresence(months);
    }, [data?.tanggalMulai, data?.tanggalSelesai, data?.cutiBulanan]);

    useEffect(() => {
        if (data?.metodePembayaran === "Bulanan" && data.tanggalMulai && data.tanggalSelesai) {
            const totalMonths = getMonthDifference(data.tanggalMulai, data.tanggalSelesai);
            if (totalMonths > 0) {
                setMonthlyPercentages(new Array(totalMonths).fill(0));
            }
        }
    }, [data?.tanggalMulai, data?.tanggalSelesai, data?.metodePembayaran]);

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
                    Kontrak Kerja Freelancer
                </h1>
                <span className="text-sm text-(--color-muted)">ID: {data.id}</span>
            </div>

            <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <form className="space-y-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">Nama Freelancer</label>
                            <input
                                type="text"
                                name="namaFreelance"
                                value={data.namaFreelance}
                                placeholder="Masukkan nama freelancer"
                                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                disabled
                            />
                        </div>
        
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">Nama Project</label>
                            <input
                                type="text"
                                name="projectName"
                                value={data.projectName}
                                placeholder="Masukkan nama project"
                                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                disabled
                            />
                        </div>
        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Tanggal Mulai
                                </label>
                                <input
                                    type="date"
                                    name="tanggalMulai"
                                    value={data.tanggalMulai}
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    disabled
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Tanggal Selesai
                                </label>
                                <input
                                    type="date"
                                    name="tanggalSelesai"
                                    value={data.tanggalSelesai}
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Jumlah Cuti (per bulan)</label>
                                <input
                                    type="number"
                                    value={data.absensiBulanan}
                                    className="bg-gray-50 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    disabled
                                />
                            </div>
                        </div>
        
                        <div className="flex flex-col">
                            <h3 className="font-medium text-gray-700 mb-3">
                                Pembagian Absensi dan Cuti Tiap Bulan
                            </h3>
                            <div className="flex flex-col gap-4">
                                <div className="w-full flex flex-row font-semibold text-sm text-gray-600">
                                    <span className="w-1/3 text-left">Bulan</span>
                                    <span className="w-1/3 text-center">Absensi</span>
                                    <span className="w-1/3 text-right">Cuti</span>
                                </div>
                                {monthlyPresence.map((data, i) => (
                                    <div key={i} className="w-full flex flex-row text-sm text-gray-700 py-2 border-b">
                                        <span className="w-1/3 text-left">{data.bulan}</span>
                                        <span className="w-1/3 text-center">{data.absensi} hari</span>
                                        <span className="w-1/3 text-right">{data.cuti} hari</span>
                                    </div>
                                ))}
                            </div>
                        </div>
        
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">Tipe Pembayaran</label>
                            <input
                                name="paymentType"
                                value={data.metodePembayaran}
                                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>
        
                        <div className="flex </select>flex-col sm:flex-row gap-4">
                            <div className="flex flex-col flex-1">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Nominal Pembayaran (Rp)
                                </label>
                                <input
                                    type="number"
                                    name="paymentAmount"
                                    value={data.pembayaran}
                                    onChange={handleChange}
                                    placeholder="cth: 50000000"
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    required
                                />
                            </div>
        
                            {formData.paymentType === "DP+Final" && (
                                <div className="flex flex-col w-full sm:w-1/3">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Persentase DP (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="dpPercentage"
                                        value={formData.dpPercentage}
                                        onChange={handleChange}
                                        min={0}
                                        max={100}
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>
                            )}
                        </div>
        
                        {formData.paymentType === "Bulanan" && monthlyPercentages.length > 0 && (
                            <div>
                                <h3 className="font-medium text-gray-700 mb-3">
                                    Pembagian Persentase Tiap Bulan
                                </h3>
                                <div className="flex flex-col gap-4">
                                    <div className="w-full flex flex-row font-semibold text-sm text-gray-600">
                                        <span className="w-1/3 text-left">Bulan</span>
                                        <span className="w-1/3 text-center">Persentase</span>
                                        <span className="w-1/3 text-right">Jumlah</span>
                                    </div>
                                    {monthlyPercentages.map((percent, i) => {
                                        const amount = (formData.paymentAmount * percent) / 100 || 0;
                                        return (
                                            <div
                                                key={i}
                                                className="w-full flex flex-row gap-4"
                                            >
                                                <label className="w-1/3 text-left text-sm text-gray-600">
                                                    Bulan {i + 1}
                                                </label>
                                                <input
                                                    type="number"
                                                    value={percent}
                                                    onChange={(e) => handleMonthPercentageChange(i, e.target.value)}
                                                    className="w-1/3 text-center border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                />
                                                <input
                                                    type="text"
                                                    disabled
                                                    value={amount.toLocaleString("id-ID", {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    })}
                                                    className="w-1/3 justify-end border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                <p
                                    className={`mt-2 text-sm ${
                                        totalPercentage === 100
                                            ? "text-green-600"
                                            : "text-red-500 font-medium"
                                    }`}
                                >
                                    Total: {totalPercentage}%
                                </p>
                            </div>
                        )}
        
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">Catatan Tambahan</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Masukkan catatan tambahan (opsional)"
                                rows={3}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            ></textarea>
                        </div>
        
                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 active:scale-[0.98] transition"
                            >
                                <Image src={icons.saveLogo} alt="Save Logo" width={18} height={18} />
                                Simpan Kontrak
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
