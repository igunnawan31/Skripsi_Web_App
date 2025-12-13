"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { useProject } from "@/app/lib/hooks/project/useProject";
import toast from "react-hot-toast";
import CustomToast from "@/app/rootComponents/CustomToast";
import { ProjectStatus } from "@/app/lib/types/fixTypes";
import ConfirmationPopUpModal from "@/app/dashboard/dashboardComponents/allComponents/ConfirmationPopUpModal";

export default function UpdateProjectPage({ id }: { id: string }) {
    const router = useRouter();
    const { data: fetchedData, isLoading, error} = useProject().fetchProjectById(id);
    const updateProject = useProject().UpdateProject();
    const { isPending } = updateProject;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        status: "",
        description: "",
        startDate: "",
        endDate: "",
    });

    const data = fetchedData;

    const handleOpenModal = () => {
        if (!formData.name.trim()) {
            toast.custom(<CustomToast type="error" message="Nama project harus diisi" />)
            return;
        }

        if (!formData.description.trim()) {
            toast.custom(<CustomToast type="error" message="Deskripsi project harus diisi" />)
            return;
        }        

        if (!formData.startDate || !formData.endDate) {
            toast.custom(<CustomToast type="error" message="Tanggal mulai dan Tanggal selesai harus diisi" />)
            return;
        }

        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            toast.custom(<CustomToast type="error" message="Tanggal selesai tidak boleh lebih dari tanggal mulai" />)
            return;
        }

        setIsModalOpen(true);
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value, 
        }));
    };

    const handleSubmit = () => {
        if (!data) return;

        updateProject.mutate(
            {
                id: data.id,
                name: formData.name,
                status: formData.status,
                description: formData.description,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
            },
            {
                onSuccess: () => {
                    toast.custom(
                        <CustomToast 
                            type="success" 
                            message="Project berhasil diupdate"
                        />
                    );
                    setIsModalOpen(false);
                    setTimeout(() => {
                        router.push("/dashboard/manajemen-project");
                    }, 2000);
                },
                onError: (error) => {
                    toast.custom(
                        <CustomToast type="error" message={error.message} />
                    );
                    setIsModalOpen(false);
                },
            }
        );
    };

    useEffect(() => {
        if (data) {
            setFormData({
                name: data.name ?? "",
                status: data.status ?? "",
                description: data.description ?? "",
                startDate: data.startDate?.slice(0, 10) ?? "",
                endDate: data.endDate?.slice(0, 10) ?? "",
            });
        }
    }, [data]);

    if (isLoading) {
        return <div className="text-center text-(--color-muted)">Memuat data...</div>;
    }

    if (!fetchedData) {
        return <div className="text-center text-red-500">Data tidak ditemukan.</div>;
    }

    const renderHtml = (
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
                        Update Project
                    </h1>
                </div>
                <span className="text-sm text-(--color-muted)">{data.id}</span>
            </div>
            <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Nama Project</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Masukkan nama freelancer"
                            className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Deskripsi Project</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Masukkan deskripsi project"
                            className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            Status Project
                        </label>
                        <select
                            name="status"
                            value={formData.status ?? ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    status: e.target.value as ProjectStatus,
                                })
                            }
                            className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        >
                            <option value="">-- Pilih Status --</option>
                            {Object.values(ProjectStatus).map((status) => (
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
                                name="startDate"
                                value={formData.startDate}
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
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={handleOpenModal}
                            disabled={isPending}
                            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white transition cursor-pointer
                                ${isPending
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-yellow-500 hover:bg-yellow-600 active:scale-[0.98]"
                                }`}
                        >
                            <Image src={icons.saveLogo} alt="Save Logo" width={18} height={18} />
                            {isPending ? "Menyimpan..." : "Simpan Project"}
                        </button>
                    </div>
                </form>
            </div>
            <ConfirmationPopUpModal
                isOpen={isModalOpen}
                onAction={handleSubmit}
                onClose={() => setIsModalOpen(false)}
                type="success"
                title={"Konfirmasi Update Project"}
                message={"Apakah Anda yakin sudah mengisi data dengan baik"}
                activeText={"Simpan"}
                passiveText="Batal"
            />
        </div>  
    );
    return renderHtml;
}