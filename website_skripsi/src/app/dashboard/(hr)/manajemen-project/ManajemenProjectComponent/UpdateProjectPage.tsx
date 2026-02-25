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
import { ProjectPatchRequest, ProjectStatus } from "@/app/lib/types/project/projectTypes";
import { fetchFileBlob } from "@/app/lib/path";

export default function UpdateProjectPage({ id }: { id: string }) {
    const router = useRouter();
    const { data: fetchedData, isLoading, error} = useProject().fetchProjectById(id);
    const updateProject = useProject().UpdateProject();
    const { isPending } = updateProject;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [documentFiles, setDocumentFiles] = useState<File[]>([]);
    const [previewDocumentUrl, setPreviewDocumentUrl] = useState<string | null>(null);
    const [activePreviewIndex, setActivePreviewIndex] = useState<number | null>(null);

    const [formData, setFormData] = useState<Partial<ProjectPatchRequest>>({
        name: "",
        status: "",
        description: "",
        startDate: "",
        endDate: "",
        projectDocument: null,
        removeDocuments: []
    });
    const [errors, setErrors] = useState({
        name: "",
        status: "",
        description: "",
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        return () => {
            documentFiles.forEach(file => URL.revokeObjectURL(file as any));
            if (previewDocumentUrl) URL.revokeObjectURL(previewDocumentUrl);
        };
    }, [documentFiles, previewDocumentUrl]);

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

    const handleAddDocuments = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        if (files.some(file => file.type !== "application/pdf")) {
            toast.custom(<CustomToast type="error" message="Hanya file PDF yang diperbolehkan" />);
            return;
        }
        if (files.some(file => file.size > 10 * 1024 * 1024)) {
            toast.custom(<CustomToast type="error" message="Ukuran file maksimal 10MB" />);
            return;
        }

        setDocumentFiles(prev => [...prev, ...files]);

        setFormData(prev => ({
            ...prev,
            projectDocument: [...(prev.projectDocument || []), ...files]
        }));
    };

    const handleChangeDocument = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;


        if (file.type !== "application/pdf") {
            toast.custom(<CustomToast type="error" message="Hanya file PDF yang diperbolehkan" />);
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.custom(<CustomToast type="error" message="Ukuran file maksimal 10MB" />);
            return;
        }

        setDocumentFiles(prev => {
            const copy = [...prev];
            copy[index] = file;
            return copy;
        });

        setFormData(prev => {
            const copy = [...(prev.projectDocument || [])];
            copy[index] = file;
            return { ...prev, projectDocument: copy };
        });

        toast.custom(<CustomToast type="success" message="Dokumen berhasil diganti" />);
    };

    const handleDeleteDocument = (index: number) => {
        setDocumentFiles(prev => {
            const copy = [...prev];
            copy.splice(index, 1);
            return copy;
        });

        setFormData(prev => {
            const copy = [...(prev.projectDocument || [])];
            copy.splice(index, 1);
            return { ...prev, projectDocument: copy };
        });

        toast.custom(<CustomToast type="success" message="Dokumen berhasil dihapus" />);
    };

    const handlePreviewFile = (index: number) => {
        const file = documentFiles[index];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setPreviewDocumentUrl(url);
        setActivePreviewIndex(index);
    };

    const handleDownloadFile = (index: number) => {
        const file = documentFiles[index];
        if (!file) return;

        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();

        URL.revokeObjectURL(url);
    };


    const getFileIcon = (mimetype: any) => {
        if (!mimetype) return icons.pdfFormat;

        const typeString = typeof mimetype === 'object' ? mimetype.mimetype : mimetype;
        if (typeof typeString !== 'string') return icons.pdfFormat;
        if (typeString.includes("image/")) return icons.imageFormat;
        if (typeString.includes("application/pdf")) return icons.pdfFormat;

        return icons.pdfFormat;
    };

    const handleOpenModal = () => {
        const newErrors = { 
            name: "", 
            description: "",
            status: "", 
            startDate: "", 
            endDate: "",
            projectDocument: ""
        };
        let isValid = true;

        if (!formData.name?.trim()) {
            newErrors.name = "Nama project harus diisi";
            isValid = false;
        }
        if (!formData.description?.trim()) {
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
        } else if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
            newErrors.endDate = "Tanggal selesai tidak boleh sebelum tanggal mulai";
            isValid = false;
        }

        if (documentFiles.length === 0) {
            newErrors.projectDocument = "Minimal satu dokumen project harus diunggah";
            isValid = false;
        }

        setErrors(newErrors as any);

        if (isValid) {
            setIsModalOpen(true);
        } else {
            toast.custom(<CustomToast type="error" message="Mohon periksa kembali form Anda" />);
        }
    };

    const handleSubmit = () => {
        if (!data) return;

        updateProject.mutate({id: data.id, projectData: formData}, {
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
        const loadData = async () => {
            if (!data) return;

            setFormData({
                name: data.name ?? "",
                status: data.status ?? "",
                description: data.description ?? "",
                startDate: data.startDate?.slice(0, 10) ?? "",
                endDate: data.endDate?.slice(0, 10) ?? "",

                projectDocument: null,
            });

            if (Array.isArray(data.documents) && data.documents.length > 0) {
                const pdfFiles: File[] = [];

                for (const doc of data.documents) {
                    if (!doc.path) continue;
                    try {
                        const blob = await fetchFileBlob(doc.path);
                        const file = new File([blob], doc.originalname ?? "Unknown Document", {
                            type: doc.mimetype ?? "application/pdf",
                        });
                        pdfFiles.push(file);
                    } catch (err) {
                        console.error("Load document error:", err);
                    }
                }

                setDocumentFiles(pdfFiles);
            }
        };

        loadData();
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
                        <label className="text-sm font-medium text-gray-600 mb-1">Status Project</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        >
                            <option value="">-- Status Project --</option>
                            {Object.values(ProjectStatus).map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
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

                    <div className="flex flex-col gap-4">
                        <label className="text-sm font-medium text-gray-600 mb-1">Upload Document Asli (pdf)</label>
                        {documentFiles.length > 0 ? (
                            documentFiles.map((file, index) => (
                                <div key={index} className="flex justify-between items-center rounded-lg p-4 border border-(--color-border) shadow-sm hover:shadow-md transition-shadow bg-white">
                                    <div className="flex flex-row gap-4">
                                        <div className="w-20 h-20 bg-(--color-secondary) rounded-lg items-center justify-center relative">
                                            <Image
                                                src={getFileIcon(file.type)}
                                                fill
                                                alt="Document Format"
                                                className="object-cover p-1 rounded-lg"
                                            />
                                        </div>

                                        <div className="flex flex-col justify-center gap-1">
                                            <p className="text-md font-bold">{file.name}</p>
                                            <p className="text-sm font-medium text-(--color-text-secondary)">{file.type}</p>
                                            <span
                                                onClick={() => handlePreviewFile(index)}
                                                className="text-xs cursor-pointer hover:underline text-(--color-muted)"
                                            >
                                                See File
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-center items-center gap-4">
                                        <input
                                            type="file"
                                            id={`changeDoc-${index}`}
                                            accept="application/pdf"
                                            onChange={(e) => handleChangeDocument(index, e)}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor={`changeDoc-${index}`}
                                            className="text-sm rounded-lg text-white bg-(--color-tertiary) px-3 py-2 cursor-pointer"
                                        >
                                            Change
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteDocument(index)}
                                            className="text-sm rounded-lg text-white bg-(--color-primary) px-3 py-2 cursor-pointer hover:bg-red-800"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDownloadFile(index)}
                                            className="p-4 bg-(--color-primary) rounded-lg justify-center items-center cursor-pointer hover:bg-red-800"
                                        >
                                            <Image
                                                src={icons.download}
                                                alt="Download File"
                                                height={24}
                                                width={24}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-(--color-muted) py-6 italic">
                                Belum ada dokumen / lampiran pendukung.
                            </div>
                        )}
                        {previewDocumentUrl && activePreviewIndex !== null && (
                            <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
                                <div className="bg-white w-3/4 h-3/4 rounded-xl p-4 relative">
                                    <div className="flex justify-between mb-4">
                                        <p className="text-md font-bold">{documentFiles[activePreviewIndex].name}</p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreviewDocumentUrl(null);
                                                setActivePreviewIndex(null);
                                            }}
                                            className="rounded-lg p-2 bg-(--color-primary) hover:bg-red-800 cursor-pointer"
                                        >
                                            <Image src={icons.closeMenu} width={24} height={24} alt="Close" />
                                        </button>
                                    </div>

                                    <iframe src={previewDocumentUrl ?? undefined} className="w-full h-[90%] rounded-lg" />
                                </div>
                            </div>
                        )}
                        <input
                            type="file"
                            id="addDocuments"
                            multiple
                            accept="application/pdf"
                            onChange={handleAddDocuments}
                            className="hidden"
                        />
                        <label
                            htmlFor="addDocuments"
                            className="mt-2 flex items-center justify-center text-sm rounded-lg text-(--color-textPrimary) bg-(--color-surface) border-(--color-border) border-2 hover:border-(--color-tertiary) px-4 py-2 cursor-pointer"
                        >
                            Tambah Dokumen
                        </label>
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