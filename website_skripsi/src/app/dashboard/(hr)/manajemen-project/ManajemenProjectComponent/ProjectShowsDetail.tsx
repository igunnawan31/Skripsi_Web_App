"use client";

import { useState } from "react";
import { User} from "@/app/lib/types/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { useProject } from "@/app/lib/hooks/project/useProject";
import { useQueries } from "@tanstack/react-query";
import Cookies from "js-cookie";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProjectShowsDetail({ id }: { id: string }) {
    const { data: fetchedData, isLoading, error } = useProject().fetchProjectById(id);
    const [openHistory, setOpenHistory] = useState(false);
    const [openAnggota, setOpenAnggota] = useState(false);
    const router = useRouter();
    const data = fetchedData;
    const teams = fetchedData?.projectTeams ?? [];
    const userIds = teams.map((pt: any) => pt.userId);

    const userQueries = useQueries({
        queries: userIds.map((userId: string) => ({
            queryKey: ["user", userId],
            queryFn: async (): Promise<User> => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const res = await fetch(`${API}/users/${userId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch user");

                return res.json();
            },
            enabled: !!userId,
            staleTime: 5 * 60 * 1000,
        })),
    });

    const userMap = userQueries.reduce<Record<string, string>>(
        (acc, q, index) => {
            if (q.data) {
                acc[userIds[index]] = (q.data as User).name;
            }
            return acc;
        },
        {}
    );
    
    if (isLoading) {
        return <div className="text-center text-(--color-muted)">Memuat data...</div>;
    };

    if (!fetchedData) {
        return <div className="text-center text-red-500">Data tidak ditemukan.</div>;
    };

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
                        Detail Project
                    </h1>
                </div>
                <span className="text-sm text-(--color-muted)">{data.id}</span>
            </div>

            <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                <form className="space-y-6">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Nama Project</label>
                        <input
                            type="text"
                            name="name"
                            value={data.name}
                            placeholder="Masukkan nama project"
                            className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            Status Project
                        </label>
                        <input
                            type="text"
                            name="status"
                            value={data.status ?? ""}
                            placeholder="Status Kerja"
                            className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Deskripsi Project</label>
                        <textarea
                            name="description"
                            value={data.description}
                            placeholder="Masukkan catatan tambahan (opsional)"
                            rows={3}
                            className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled
                        ></textarea>
                    </div>
    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">
                                Tanggal Mulai
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={data.startDate ? data.startDate.substring(0, 10) : ""} 
                                className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2"
                                disabled
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">
                                Tanggal Selesai
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={data.endDate ? data.endDate.substring(0, 10) : ""} 
                                className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2"
                                disabled
                            />
                        </div>
                    </div>
                    
                    <div className="flex flex-col mt-6 border-t border-(--color-border) pt-6">
                        <h2 className="text-lg font-semibold text-(--color-text-primary) mb-4">
                            Data Anggota Project
                        </h2>
                        {teams.length > 0 ? (
                            teams.map((pt: any) => {
                                return (
                                    <div
                                        key={`${pt.projectId}-${pt.userId}`}
                                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg bg-gray-50"
                                    >
                                        <div className="flex flex-col mb-4">
                                            <label className="text-sm font-medium text-gray-600 mb-1">
                                                Role
                                            </label>
                                            <input
                                                type="string"
                                                name="roles"
                                                value={pt.role} 
                                                className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2"
                                                disabled
                                            />
                                        </div>
                                        <div className="flex flex-col mb-4">
                                            <label className="text-sm font-medium text-gray-600 mb-1">
                                                User
                                            </label>
                                            <input
                                                type="string"
                                                name="userId"
                                                value={userMap[pt.userId] ?? "Memuat user..."} 
                                                className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                )                      
                            })
                        ) : (
                            <p className="text-center text-gray-500 py-6">Tidak ada data anggota</p>
                        )}    
                    </div>

                    <div className="flex flex-col mt-6 border-t border-(--color-border) pt-6">
                        <button
                            type="button"
                            onClick={() => setOpenHistory((prev) => !prev)}
                            className="flex justify-between items-center w-full cursor-pointer mb-4"
                        >
                            <h2 className="text-lg font-semibold text-(--color-text-primary)">
                                History Pembuatan Project
                            </h2>
                            <Image
                                src={icons.arrowData}
                                width={20}
                                height={20}
                                alt="Arrow Data"
                                className={`transition-transform duration-300 ${
                                    openHistory ? "-rotate-90" : "rotate-0"
                                }`}
                            />
                        </button>
                        {openHistory && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Tanggal Pembuatan
                                    </label>
                                    <input
                                        type="date"
                                        name="createdAt"
                                        value={data.createdAt ? data.createdAt.substring(0, 10) : ""} 
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
                                        name="updatedAt"
                                        value={data.updatedAt ? data.updatedAt.substring(0, 10) : ""} 
                                        className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2"
                                        disabled
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
