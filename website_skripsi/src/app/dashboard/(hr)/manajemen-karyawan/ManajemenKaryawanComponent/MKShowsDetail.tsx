"use client";

import { useEffect, useState } from "react";
import { KontrakKerja, User, WorkStatus } from "@/app/lib/types/types";
import { dummyKontrakKerja } from "@/app/lib/dummyData/KontrakKerjaData";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { dummyUsers } from "@/app/lib/dummyData/dummyUsers";
import Link from "next/link";

export default function MKShowsDetail({ id }: { id: string }) {
    const [data, setData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    useEffect(() => {
        const timer = setTimeout(() => {
            const found = dummyUsers.find((item) => item.id === id);
            setData(found || null);
            setLoading(false);
        }, 400);

        return () => clearTimeout(timer);
    }, [id]);

    const kontrakKerjaUser = dummyKontrakKerja.filter(
        (item) => item.namaFreelance === data?.nama
    );

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
                    User Detail
                </h1>
                <span className="text-sm text-(--color-muted)">ID: {data.id}</span>
            </div>

            <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                    <form className="space-y-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">Nama</label>
                            <input
                                type="text"
                                name="namaFreelance"
                                defaultValue={data.nama}
                                placeholder="Masukkan nama freelancer"
                                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                disabled
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">Email</label>
                            <input
                                type="text"
                                name="email"
                                defaultValue={data.email}
                                placeholder="Masukkan nama freelancer"
                                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                disabled
                            />
                        </div>
                        <div className="relative flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                defaultValue={data.password}
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
                                    defaultValue={data.majorRole ?? ""}
                                    placeholder="Status Kerja"
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    disabled
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Role Minor
                                </label>
                            <input
                                    type="text"
                                    name="minorRole"
                                    defaultValue={data.minorRole ?? ""}
                                    placeholder="Status Kerja"
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    disabled
                                />
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
                                    defaultValue={data.tanggalMulai}
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
                                    defaultValue={data.tanggalSelesai}
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    disabled
                                />
                            </div>
                        </div>
                       <div className="flex flex-col gap-2 mt-3">
                            {kontrakKerjaUser.length > 0 ? 
                                kontrakKerjaUser.map(k => (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-600 mb-1">
                                                Nama Project
                                            </label>
                                            <input
                                                name="projectName"
                                                defaultValue={k.project?.projectName}
                                                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                disabled
                                            />
                                        </div>
                                        <div className="flex flex-col mt-5.5">
                                            <Link
                                                key={k.id}
                                                href={`/dashboard/kontrak-kerja-karyawan/${k.id}`}
                                                className="px-3 py-2.5 rounded-lg bg-(--color-tertiary) hover:bg-opacity-80 flex justify-between"
                                            >
                                                <span className="text-(--color-surface)">
                                                    Lihat Kontrak Kerja ({k.project?.projectName})
                                                </span>
                                                <Image
                                                    src={icons.arrowMenu}
                                                    alt="Show password"
                                                    width={20}
                                                    height={20}
                                                    priority
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-gray-500 text-sm">
                                        Tidak ada kontrak kerja
                                    </p>
                                )
                            }
                        </div>
        
                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                            >
                                Kembali ke Manajemen Karyawan
                            </button>
                        </div>
                    </form>
            </div>
        </div>
    );
}
