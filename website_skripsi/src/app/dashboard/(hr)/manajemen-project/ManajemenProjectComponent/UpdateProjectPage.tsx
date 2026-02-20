"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { icons, logo } from "@/app/lib/assets/assets";
import { useProject } from "@/app/lib/hooks/project/useProject";
import toast from "react-hot-toast";
import CustomToast from "@/app/rootComponents/CustomToast";
import ConfirmationPopUpModal from "@/app/dashboard/dashboardComponents/allComponents/ConfirmationPopUpModal";
import SkeletonDetail from "./ProjectSkeletonDetail";

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
    const [errors, setErrors] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
    });

    const data = fetchedData;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        
        setFormData((prev) => ({
            ...prev,
            [name]: value, 
        }));

        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleOpenModal = () => {
        const newErrors = { name: "", description: "", status: "", startDate: "", endDate: "" };
        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = "Nama project harus diisi";
            isValid = false;
        }
        if (!formData.description.trim()) {
            newErrors.description = "Deskripsi project harus diisi";
            isValid = false;
        }
        if (!formData.status) {
            newErrors.status = "Status project harus dipilih";
            isValid = false;
        }
        if (!formData.startDate) {
            newErrors.startDate = "Tanggal mulai harus diisi";
            isValid = false;
        }
        if (!formData.endDate) {
            newErrors.endDate = "Tanggal selesai harus diisi";
            isValid = false;
        } else if (new Date(formData.startDate) > new Date(formData.endDate)) {
            newErrors.endDate = "Tanggal selesai tidak boleh sebelum tanggal mulai";
            isValid = false;
        }

        setErrors(newErrors);

        if (isValid) {
            setIsModalOpen(true);
        } else {
            toast.custom(<CustomToast type="error" message="Mohon periksa kembali form Anda" />);
        }
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
        return <SkeletonDetail />;
    };

    if (!fetchedData) {
        const noFetchedData = (
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
                <div className="w-full bg-(--color-surface) rounded-2xl shadow-md px-6 py-12 border border-(--color-border) flex flex-col gap-6">
                    <div className="flex flex-col items-center justify-between gap-4">
                        <Image
                            src={logo.notFound}
                            width={240}
                            height={240}
                            alt="Not Found Data"
                        />
                        <div className="flex flex-col items-center">
                            <h1 className="text-2xl font-bold text-(--color-primary)">
                                Detail Project Tidak Ditemukan
                            </h1>
                            <span className="text-sm text-(--color-primary)">Mohon mengecek kembali detail project nanti</span>
                        </div>
                    </div>
                </div>
            </div>
        );
        
        return noFetchedData;
    }

    if (error) {
        const errorFetchedData = (
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
                <div className="w-full bg-(--color-surface) rounded-2xl shadow-md px-6 py-12 border border-(--color-border) flex flex-col gap-6">
                    <div className="flex flex-col items-center justify-between gap-4">
                        <Image
                            src={logo.error}
                            width={240}
                            height={240}
                            alt="Not Found Data"
                        />
                        <div className="flex flex-col items-center">
                            <h1 className="text-2xl font-bold text-(--color-primary)">
                                {error.message ? error.message : "Terdapat kendala pada sistem"}
                            </h1>
                            <span className="text-sm text-(--color-primary)">Mohon untuk melakukan refresh atau kembali ketika sistem sudah selesai diperbaiki</span>
                        </div>
                    </div>
                </div>
            </div>
        );

        return errorFetchedData;
    };

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
                        Update Project - {data?.name}
                    </h1>
                </div>
                <span className="text-sm text-(--color-muted)">{data.id}</span>
            </div>
            <div className="w-full bg-(--color-surface) rounded-2xl shadow-md p-6 border border-(--color-border) flex flex-col gap-6">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Nama Project <span className="text-(--color-primary)">*</span></label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Masukkan nama project"
                            className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                                errors.name ? "border-(--color-primary)" : "border-(--color-border)"
                            }`}
                        />
                        {errors.name && (
                            <p className="text-xs text-(--color-primary) mt-1 animate-in fade-in slide-in-from-top-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Deskripsi Project <span className="text-(--color-primary)">*</span></label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Masukkan deskripsi project"
                            className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors min-h-[100px] ${
                                errors.description ? "border-(--color-primary)" : "border-(--color-border)"
                            }`}
                        />
                        {errors.description && (
                            <p className="text-xs text-(--color-primary) mt-1">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">Tanggal Mulai <span className="text-(--color-primary)">*</span></label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                                    errors.startDate ? "border-(--color-primary)" : "border-(--color-border)"
                                }`}
                            />
                            {errors.startDate && (
                                <p className="text-xs text-(--color-primary) mt-1">{errors.startDate}</p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">Tanggal Selesai <span className="text-(--color-primary)">*</span></label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                                    errors.endDate ? "border-(--color-primary)" : "border-(--color-border)"
                                }`}
                            />
                            {errors.endDate && (
                                <p className="text-xs text-(--color-primary) mt-1">{errors.endDate}</p>
                            )}
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