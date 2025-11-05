"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { 
    KontrakKerjaForm,
    Gaji,
    MajorRole,
    MinorRole,
    KontrakKerjaStatus,
    Project,
    WorkStatus,
} from "@/app/lib/types/types";
import { dummyProject } from "@/app/lib/dummyData/ProjectData";

const CreateKontrakKerjaPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<KontrakKerjaForm>({
        namaFreelance: "",
        project: null,
        workStatus: null,
        majorRole: null,
        minorRole: null,
        tanggalMulai: "",
        tanggalSelesai: "",
        password: "12345678",
        metodePembayaran: "Bulanan",
        totalBayaran: 0,
        absensiBulanan: 0,
        cutiBulanan: 0,
        pembayaran: [],
        status: KontrakKerjaStatus.AKTIF,
        catatan: "",
        dpPercentage: 0,
        finalPercentage: 100,
        kontrakKerjaPDF: "",
    });
    const [monthlyPercentages, setMonthlyPercentages] = useState<number[]>([]);
    const [monthlyPresence, setMonthlyPresence] = useState<{ bulan: string; absensi: number; cuti: number }[]>([]);

    // Menghitung Perbedaan Bulan
    const getMonthDifference = (startDate: string, endDate: string): number => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const years = end.getFullYear() - start.getFullYear();
        const months = end.getMonth() - start.getMonth();
        return years * 12 + months + 1;
    };

    // Client State untuk Payment dan Absensi
    useEffect(() => {
        if (formData.metodePembayaran === "Bulanan" && formData.tanggalMulai && formData.tanggalSelesai) {
            const totalMonths = getMonthDifference(formData.tanggalMulai, formData.tanggalSelesai);
            if (totalMonths > 0) {
                setMonthlyPercentages(new Array(totalMonths).fill(0));
            }
        }
    }, [formData.tanggalMulai, formData.tanggalSelesai, formData.metodePembayaran]);

    useEffect(() => {
        if (!formData.tanggalMulai || !formData.tanggalSelesai) return;

        const start = new Date(formData.tanggalMulai);
        const end = new Date(formData.tanggalSelesai);
        const cuti = Number(formData.cutiBulanan ?? 0);

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
    }, [formData.tanggalMulai, formData.tanggalSelesai, formData.cutiBulanan]);


    const handleMonthPercentageChange = (index: number, value: string) => {
        const newPercentages = [...monthlyPercentages];
        newPercentages[index] = Number(value);
        setMonthlyPercentages(newPercentages);
    };

    const totalPercentage = monthlyPercentages.reduce((a, b) => a + b, 0);

    const handleChange = ( 
        e: React.ChangeEvent< HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement 
        > 
    ) => { 
        const { name, value } = e.target; 
        setFormData((prev) => ({ 
            ...prev, 
            [name]: name === "totalBayaran" 
                ? Number(value) : (value as string), 
        })); 
    };

    const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^\d]/g, "");
        setFormData({
            ...formData,
            totalBayaran: Number(rawValue),
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.metodePembayaran === "Bulanan" && totalPercentage !== 100) {
            alert("Total persentase bulanan harus 100%");
            return;
        }

        const payload = {
            ...formData,
            monthlyPercentages,
        };

        console.log("Submitted Kontrak:", payload);
        alert("Kontrak berhasil dibuat!");
        router.push("/dashboard/kontrak-kerja-karyawan");
    };

    const renderHtml = (
        <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 mt-6 mb-8">
            <h1 className="text-xl font-semibold text-gray-800 mb-6">
                Buat Kontrak Kerja Freelancer
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Nama Freelancer</label>
                    <input
                        type="text"
                        name="namaFreelance"
                        value={formData.namaFreelance}
                        onChange={handleChange}
                        placeholder="Masukkan nama freelancer"
                        className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Nama Project</label>
                    <select
                        name="project"
                        value={formData.project?.projectId ?? ""}
                        onChange={(e) => {
                            const selectedProject = dummyProject.find(
                                (p: any) => p.projectId === e.target.value
                            );

                            if (selectedProject) {
                                setFormData({
                                    ...formData,
                                    project: selectedProject,
                                });
                            }
                        }}
                        className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    >
                        <option value="">-- Pilih Project --</option>
                        {dummyProject.map((project: any) => (
                            <option key={project.projectId} value={project.projectId}>
                                {project.projectName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                        Status Kerja
                    </label>
                    <select
                        name="workStatus"
                        value={formData.workStatus ?? ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                workStatus: e.target.value as WorkStatus,
                            })
                        }
                        className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    >
                        <option value="">-- Pilih Status Kerja --</option>
                        {Object.values(WorkStatus).map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            Tanggal Mulai
                        </label>
                        <input
                            type="date"
                            name="tanggalMulai"
                            value={formData.tanggalMulai}
                            onChange={handleChange}
                            className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            Tanggal Selesai
                        </label>
                        <input
                            type="date"
                            name="tanggalSelesai"
                            value={formData.tanggalSelesai}
                            onChange={handleChange}
                            className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Jumlah Cuti (per bulan)</label>
                        <input
                            type="number"
                            min={0}
                            value={formData.cutiBulanan}
                            onChange={(e) => setFormData({ ...formData, cutiBulanan: Number(e.target.value) })}
                            className="w-full border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                            <div
                                key={i}
                                className="flex flex-row text-sm text-gray-700 py-2 border-b"
                            >
                                <span className="w-1/3 text-left">{data.bulan}</span>
                                <span className="w-1/3 text-center">{data.absensi} hari</span>
                                <span className="w-1/3 text-right">{data.cuti} hari</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Tipe Pembayaran</label>
                    <select
                        name="metodePembayaran"
                        value={formData.metodePembayaran}
                        onChange={handleChange}
                        className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        <option value="Bulanan">Bulanan</option>
                        <option value="DP+Final">DP + Final</option>
                        <option value="Per_Project">Per Project</option>
                    </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col flex-1">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            Nominal Pembayaran (Rp)
                        </label>
                        <div className="w-full border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 flex items-center">
                            <span className="text-gray-600">
                                Rp
                            </span>
                            <input
                                type="text"
                                name="totalBayaran"
                                value={formData.totalBayaran
                                    ? formData.totalBayaran.toLocaleString("id-ID")
                                    : ""}
                                onChange={handleNominalChange}
                                className="w-full px-3 py-1 rounded-lg focus:outline-none transition-all"
                                placeholder="cth: 50.000.000"
                                required
                            />
                        </div>
                    </div>

                    {formData.metodePembayaran === "DP+Final" && (
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
                                className="border border-(--color-border) rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>
                    )}
                </div>

                {formData.metodePembayaran === "Bulanan" && (
                    <div>
                        <h3 className="font-medium text-gray-700 mb-3">
                            Pembagian Persentase Tiap Bulan
                        </h3>
                        {monthlyPercentages.map((percent, i) => {
                            const amount = (formData.totalBayaran * percent) / 100;
                            return (
                                <div key={i} className="flex flex-row gap-4 mb-2">
                                    <label className="w-1/3 text-sm text-gray-600">
                                        Bulan {i + 1}
                                    </label>
                                    <input
                                        type="number"
                                        value={percent}
                                        onChange={(e) =>
                                            handleMonthPercentageChange(i, e.target.value)
                                        }
                                        className="w-1/3 text-center border rounded-lg px-3 py-2"
                                    />
                                    <input
                                        type="text"
                                        disabled
                                        value={amount.toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        })}
                                        className="w-1/3 text-right border rounded-lg px-3 py-2 bg-gray-50"
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

                <div>
                    <label className="text-sm font-medium text-gray-600 mb-1">
                        Certification Docs
                    </label>
                    <div className="border border-(--color-border) rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 justify-between w-full flex items-center">
                        <span className="truncate text-gray-600">
                            {/* {certificationDocs
                                ? certificationDocs.name
                                : (certificate?.document?.[0]?.path?.split("\\").pop() || "No document selected")} */}
                            nama document
                        </span>
                        <input
                            type="file"
                            id="certDocUpload"
                            className="hidden"
                        />
                        <label
                            htmlFor="certDocUpload"
                            className="ml-3 py-2 px-2 bg-(--color-primary) text-white rounded-lg cursor-pointer hover:bg-(--color-primary)/80 text-md"
                        >
                            Upload
                        </label>
                    </div>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Catatan Tambahan</label>
                    <textarea
                        name="catatan"
                        value={formData.catatan}
                        onChange={handleChange}
                        placeholder="Masukkan catatan tambahan (opsional)"
                        rows={3}
                        className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    ></textarea>
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
                        Simpan Kontrak
                    </button>
                </div>
            </form>
        </div>
    );

    return renderHtml;
};

export default CreateKontrakKerjaPage;
