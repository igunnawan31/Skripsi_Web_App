"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { 
    KontrakKerjaForm,
    WorkStatus,
    KontrakKerjaStatus,
    MajorRole,
    MinorRole,
    User,
    UserForm,
} from "@/app/lib/types/types";
import { dummyProject } from "@/app/lib/dummyData/ProjectData";
import { dummyKontrakKerja } from "@/app/lib/dummyData/KontrakKerjaData";
import { dummyUsers } from "@/app/lib/dummyData/dummyUsers";

export default function UpdateMKPage({ id }: { id: string }) {
    const router = useRouter();
    const [data, setData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState<UserForm>({
        email: "",
        password: "",
        nama: "",
        majorRole: MajorRole.KARYAWAN,
        minorRole: MinorRole.ADMIN || null,
        tanggalMulai: "",
        tanggalSelesai: "",
        projectList: [],
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            const found = dummyUsers.find((item) => item.id === id);
            setData(found || null);
            if (found) {
                setFormData({
                    email: found.email,
                    password: found.password,
                    nama: found.nama,
                    majorRole: found.majorRole,
                    minorRole: found.minorRole,
                    tanggalMulai: found.tanggalMulai,
                    tanggalSelesai: found.tanggalSelesai,
                    projectList: found.projectList,
                });
            }
            setLoading(false);
        }, 400);

        return () => clearTimeout(timer);
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { ...formData };
        console.log("Submitted Kontrak:", payload);
        alert("Kontrak berhasil dibuat!");
        router.push("/dashboard/kontrak-kerja-karyawan");
    };

    if (loading) return <div>Loading...</div>;

    const renderHtml = (
        <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 mt-6">
            <h1 className="text-xl font-semibold text-gray-800 mb-6">
                Buat Kontrak Kerja Freelancer
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Nama</label>
                    <input
                        type="text"
                        name="nama"
                        value={formData.nama}
                        onChange={handleChange}
                        placeholder="Masukkan nama user"
                        className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Email</label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Masukkan email user"
                        className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                </div>
                <div className="relative flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="*******"
                        className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 transform text-gray-500 cursor-pointer text-lg select-none"
                        title={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? 
                            <Image
                                src={icons.openEye}
                                alt="Show password"
                                width={20}
                                height={20}
                                priority
                            />
                            : 
                            <Image
                                src={icons.closeEye}
                                alt="Hide password"
                                width={20}
                                height={20}
                                priority
                            />
                        }
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            Role Major
                        </label>
                        <input
                            type="text"
                            name="majorRole"
                            defaultValue={formData.majorRole}
                            placeholder="Status Kerja"
                            className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Password</label>
                        <select 
                            name="minorRole" id="minorRole"
                            value={formData.minorRole}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    minorRole: e.target.value as MinorRole,
                                })
                            }}
                            className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        >
                            <option value="">-- Pilih Role --</option>
                            {Object.values(MinorRole).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
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
                        Perbarui Data User 
                    </button>
                </div>
            </form>
        </div>  
    );
    return renderHtml;
}