"use client";

import { useEffect, useState } from "react";
import { KontrakKerja, User, WorkStatus } from "@/app/lib/types/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { dummyUsers } from "@/app/lib/dummyData/dummyUsers";
import Link from "next/link";
import { useUser } from "@/app/lib/hooks/user/useUser";
import { useQueries } from "@tanstack/react-query";
import Cookies from "js-cookie";
import AbsensiDataModal from "./AbsensiDataModal";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function MKShowsDetail({ id }: { id: string }) {
    const { data: fetchedData, isLoading, error } = useUser().fetchUserById(id);
    const [openProject, setOpenProject] = useState(true);
    const [openKontrak, setOpenKontrak] = useState(true);
    const router = useRouter();

    const data = fetchedData;
    const kontrak = data?.kontrak ?? [];
    const projectIds = kontrak.map(
        (pt: any) => pt.projectId
    );
    
    const projectQueries = useQueries({
        queries: projectIds.map((projectId: string) => ({
            queryKey: ["project", projectId],
            queryFn: async () => {
                const token = Cookies.get("accessToken");
                const res = await fetch(`${API}/project/${projectId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error("Failed fetch project");
                return res.json();
            },
            enabled: !!projectId,
        })),
    });

    const projectMap = projectQueries.reduce<Record<string, any>>(
        (acc, q, index) => {
            if (q.data) {
                acc[projectIds[index]] = q.data;
            }
            return acc;
        },
        {}
    );

    if (isLoading) {
        return <div className="text-center text-(--color-muted)">Memuat data...</div>;
    }

    if (!data) {
        return <div className="text-center text-red-500">Data tidak ditemukan.</div>;
    }

    return (
        <div className="flex flex-col gap-6 w-full pb-8 relative">
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
            {data.kontrak.length > 0 && (
                <AbsensiDataModal
                    absensi={data.absensi}
                    kontrak={data.kontrak[0]}
                />
            )}
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-row gap-4 items-center">
                    <h1 className="text-2xl font-bold text-(--color-text-primary)">
                        Detail Karyawan
                    </h1>
                </div>
                <span className="text-sm text-(--color-muted)">{data.id}</span>
            </div>

            <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                <form className="space-y-6">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Nama</label>
                        <input
                            type="text"
                            name="namaFreelance"
                            defaultValue={data.name}
                            placeholder="Masukkan nama freelancer"
                            className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                            className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled
                        />
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
                                className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                                className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="flex flex-col mt-6 border-t border-(--color-border) pt-6">
                        <button
                            type="button"
                            onClick={() => setOpenProject((prev) => !prev)}
                            className="flex justify-between items-center w-full cursor-pointer mb-4"
                        >
                            <h2 className="text-lg font-semibold text-(--color-text-primary)">
                                Project yang dikerjakan
                            </h2>
                            <Image
                                src={icons.arrowData}
                                width={20}
                                height={20}
                                alt="Arrow Data"
                                className={`transition-transform duration-300 ${
                                    openProject ? "-rotate-90" : "rotate-0"
                                }`}
                            />
                        </button>
                        {openProject && (
                            data.kontrak.length > 0 ? (
                                data.kontrak.map((k: any) => {
                                    const project = projectMap[k.projectId];
                                    return (
                                        <div
                                            key={k.projectId}
                                            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                                        >
                                            <div className="flex flex-col">
                                                <label className="text-sm font-medium text-gray-600 mb-1">
                                                    Nama Project
                                                </label>
                                                <input
                                                    name="projectName"
                                                    value={project?.name ?? "Loading..."}
                                                    className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                    disabled
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-medium text-gray-600 mb-1">
                                                    Role Project
                                                </label>
                                                <input
                                                    name="projectName"
                                                    defaultValue={k.role}
                                                    className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                    disabled
                                                />
                                            </div>
                                            <div className="flex flex-col mt-0 sm:mt-5.5">
                                                <Link
                                                    key={k.id}
                                                    href={`/dashboard/manajemen-project/${k.projectId}`}
                                                    className="px-3 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex justify-between"
                                                >
                                                    <span className="text-(--color-surface) truncate">
                                                        Lihat Project ({project?.name ?? "Loading..."})
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
                                    )
                                })
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    Tidak ada Project
                                </p>
                            )
                        )}
                    </div>
                    <div className="flex flex-col mt-6 border-t border-(--color-border) pt-6">
                        <button
                            type="button"
                            onClick={() => setOpenKontrak((prev) => !prev)}
                            className="flex justify-between items-center w-full cursor-pointer mb-4"
                        >
                            <h2 className="text-lg font-semibold text-(--color-text-primary)">
                                Informasi Kontrak
                            </h2>
                            <Image
                                src={icons.arrowData}
                                width={20}
                                height={20}
                                alt="Arrow Data"
                                className={`transition-transform duration-300 ${
                                    openKontrak ? "-rotate-90" : "rotate-0"
                                }`}
                            />
                        </button>
                        {openKontrak && (
                            data.kontrak.length > 0 ? (
                                data.kontrak.map((k: any) => {
                                    const project = projectMap[k.projectId];
                                    return (
                                        <div
                                            key={k.projectId}
                                            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3"
                                        >
                                            <div className="flex flex-col">
                                                <label className="text-sm font-medium text-gray-600 mb-1">
                                                    Kontrak Id
                                                </label>
                                                <input
                                                    name="id"
                                                    defaultValue={k.id}
                                                    className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                    disabled
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-medium text-gray-600 mb-1">
                                                    Project yang bersangkutan
                                                </label>
                                                <input
                                                    name="projectName"
                                                    value={project?.name ?? "Loading..."}
                                                    className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                    disabled
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-medium text-gray-600 mb-1">
                                                    Status
                                                </label>
                                                <input
                                                    name="status"
                                                    defaultValue={k.status}
                                                    className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                    disabled
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-medium text-gray-600 mb-1">
                                                    Tanggal Pembuatan
                                                </label>
                                                <input
                                                    type="date"
                                                    name="startDate"
                                                    value={k.startDate ? k.startDate.substring(0, 10) : ""} 
                                                    className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2"
                                                    disabled
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-medium text-gray-600 mb-1">
                                                    Tanggal Update Terakhir
                                                </label>
                                                <input
                                                    type="date"
                                                    name="endDate"
                                                    value={k.endDate ? k.endDate.substring(0, 10) : ""} 
                                                    className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2"
                                                    disabled
                                                />
                                            </div>
                                            <div className="flex flex-col mt-0 sm:mt-5.5">
                                                <Link
                                                    key={k.id}
                                                    href={`/dashboard/kontrak-kerja-karyawan/${k.projectId}`}
                                                    className="px-3 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex justify-between"
                                                >
                                                    <span className="text-(--color-surface) truncate line-clamp-1">
                                                        Lihat Kontrak Kerja ({k.id ?? "Loading..."})
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
                                    )
                                })
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    Tidak ada kontrak kerja
                                </p>
                            )
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
