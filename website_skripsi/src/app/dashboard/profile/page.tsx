"use client";

import { useUserLogin } from "@/app/context/UserContext";
import { icons, logo, photo } from "@/app/lib/assets/assets";
import { useUser } from "@/app/lib/hooks/user/useUser";
import { fetchFileBlob } from "@/app/lib/path";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import EditPhotoModal from "./profileComponent/EditPhotoModal";
import EditUserModal from "./profileComponent/EditUserModal";
import CustomToast from "@/app/rootComponents/CustomToast";
import toast from "react-hot-toast";
import SkeletonProfile from "./profileComponent/SkeletonProfile";

const Profile = () => {
    const user = useUserLogin();
    const { data: fetchedData, isLoading, error } = useUser().fetchUserById(user.id);
    const { mutate: updatePhoto, isPending: isPendingUpdate } = useUser().updatePhoto();
    const { mutate: updateDataUser, isPending: isPendingUpdateUser } = useUser().UpdateUser();

    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showModalEditPhoto, setShowModalEditPhoto] = useState(false);
    const [showModalEditUser, setShowModalEditUser] = useState(false);

    const [openSummaryId, setOpenSummaryId] = useState<string | null>(null);
    const toggleSummary = (id: string) => {
        setOpenSummaryId(prevId => (prevId === id ? null : id));
    };

    const loadPhoto = async (photoPath: string) => {
        try {
            const blob = await fetchFileBlob(photoPath);
            const reader = new FileReader();
            reader.onload = () => setPreviewPhoto(reader.result as string);
            reader.readAsDataURL(blob);
        } catch (err) {
            console.error("Load photo error:", err);
            setPreviewPhoto(null);
        }
    };

    useEffect(() => {
        if (fetchedData?.photo?.path) {
            loadPhoto(fetchedData.photo.path);
        }
    }, [fetchedData?.photo?.path]);

    const getFileIcon = (doc: any) => {
        const type = doc?.mimetype;
        if (!type) return icons.pdfFormat;
        if (type === "application/pdf") return icons.pdfFormat;
        if (type.startsWith("image/")) return icons.imageFormat;

        return icons.pdfFormat;
    };

    const handleDownload = async (path: string, filename: string) => {
        try {
            const blob = await fetchFileBlob(path);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            toast.custom(<CustomToast type="error" message="Gagal download file" />);
        }
    };

    const handlePreview = async (path: string) => {
        try {
            const blob = await fetchFileBlob(path);
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
        } catch {
            toast.custom(<CustomToast type="error" message="Gagal memuat file" />);
        }
    };

    if (isLoading) {
        return <SkeletonProfile />;
    };

    if (!fetchedData) {
        const noFetchedData = (
             <div className="flex flex-col gap-6 w-full pb-8">
                <div className="flex items-center gap-4">
                    <h1 className="text-yellow-600 font-semibold whitespace-nowrap">
                        My Profile
                    </h1>
                    <div className="flex-1 border-b-2 border-(--color-border)" />
                </div>
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
    };

    if (error || !user) {
        const errorRender = (
            <div className="flex flex-col gap-6 w-full pb-8">
                <div className="flex items-center gap-4">
                    <h1 className="text-yellow-600 font-semibold whitespace-nowrap">
                        My Profile
                    </h1>
                    <div className="flex-1 border-b-2 border-(--color-border)" />
                </div>
                <div className="w-full bg-(--color-surface) rounded-2xl shadow-md px-6 py-12 border border-(--color-border) flex flex-col gap-6">
                    <div className="flex flex-col items-center justify-between gap-4 py-4">
                        <Image
                            src={logo.error}
                            width={240}
                            height={240}
                            alt="Not Found Data"
                        />
                        <div className="flex flex-col items-center">
                            <h1 className="text-2xl font-bold text-(--color-primary)">
                                {error?.message ? error?.message : "Terdapat kendala pada sistem"}
                            </h1>
                            <span className="text-sm text-(--color-primary)">Mohon untuk melakukan refresh atau kembali ketika sistem sudah selesai diperbaiki</span>
                        </div>
                    </div>
                </div>
            </div>
        );

        return errorRender;
    };

    return (
        <div className="flex flex-col gap-6 w-full pb-8">
            <div className="flex items-center gap-4">
                <h1 className="text-yellow-600 font-semibold whitespace-nowrap">
                    My Profile
                </h1>
                <div className="flex-1 border-b-2 border-(--color-border)" />
            </div>

            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all flex items-center gap-8 relative"
            >
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-(--color-surface)">
                    <Image
                        src={previewPhoto ? previewPhoto : icons.userProfile}
                        alt="Profile User"
                        fill
                        className="object-cover"
                    />
                </div>
                <div
                    onClick={() => setShowModalEditPhoto((v) => !v)}
                    className="absolute left-18 top-15 p-2 bg-yellow-600 hover:bg-yellow-500 overflow-hidden rounded-full cursor-pointer"
                >
                    <Image 
                        src={icons.editLogo}
                        alt="Profile"
                        width={20}
                        height={20}
                    />
                </div>

                <div className="flex flex-col">
                    <h2 className="font-semibold text-(--color-text-primary)">
                        {fetchedData?.name}
                    </h2>
                    <span className="text-sm text-yellow-600 font-medium">
                        {fetchedData?.minorRole}
                    </span>
                    <span className="text-sm text-(--color-muted)">
                        {fetchedData?.majorRole}
                    </span>
                </div>
            </motion.div>

            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all relative"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-gray-700">
                        Personal Information
                    </h3>
                    {/* <div
                        onClick={() => setShowModalEditUser((v) => !v)}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-yellow-600 hover:bg-yellow-500 cursor-pointer text-white rounded-lg transition"
                    >
                        <Image 
                            src={icons.editLogo}
                            alt="Profile"
                            width={14}
                            height={14}
                        />
                        Edit
                    </div> */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            Nama User
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={fetchedData?.name ?? ""}
                            placeholder="Nama User"
                            className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            Email User
                        </label>
                        <input
                            type="text"
                            name="email"
                            value={fetchedData?.email ?? ""}
                            placeholder="Email User"
                            className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            User Major Role
                        </label>
                        <input
                            type="text"
                            name="majorRole"
                            value={fetchedData?.majorRole ?? ""}
                            placeholder="User Major Role"
                            className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            User Minor Role
                        </label>
                        <input
                            type="text"
                            name="minorRole"
                            value={fetchedData?.minorRole ?? ""}
                            placeholder="User Minor Role"
                            className="bg-(--color-muted)/30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled
                        />
                    </div>
                </div>
            </motion.div>

            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all relative"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-gray-700">
                        Contract Information
                    </h3>
                </div>

                <div className="flex flex-col">
                    {fetchedData?.kontrak.length > 0 ? (
                        fetchedData?.kontrak.map((dk: any) => {
                            const isThisItemOpen = openSummaryId === dk.id;

                            return (
                                <div
                                    key={dk.id}
                                    className="flex flex-col items-center rounded-lg p-4 border border-(--color-border) shadow-sm hover:shadow-md transition-shadow bg-white"
                                >
                                    <div className="w-full">
                                        <div className="flex justify-between gap-6 py-2 border-y border-gray-50">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-(--color-primary) rounded-xl">
                                                    <Image 
                                                        src={icons.kontrakKerjaLogo} 
                                                        width={24} 
                                                        height={24} 
                                                        alt="Contract" 
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 ">Contract ID</p>
                                                    <p className="text-sm font-bold text-gray-800">{dk.id}</p>
                                                </div>
                                            </div>
                                            
                                            <div className={`px-4 py-1.5 w-fit justify-center items-center flex rounded-full text-xs font-bold ${
                                                dk.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {dk.status}
                                            </div>
                                        </div>

                                        <div className="flex justify-between gap-6 py-4 border-y border-gray-50">
                                            <div className="space-y-1">
                                                <p className="text-xs text-gray-400 font-medium">Tanggal Mulai</p>
                                                <p className="text-sm font-semibold text-gray-700">{dk.startDate?.slice(0, 10) || "N/A"}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-gray-400 font-medium">Tanggal Berakhir</p>
                                                <p className="text-sm font-semibold text-gray-700">{dk.endDate?.slice(0, 10) || "N/A"}</p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => toggleSummary(dk.id)}
                                            className="flex items-center justify-between w-full mt-6 group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-yellow-600 group-hover:text-yellow-700">
                                                    {isThisItemOpen ? "Sembunyikan Lampiran" : "Lihat Lampiran & Summary"}
                                                </span>
                                                <div className={`p-1 rounded-full bg-yellow-50 transition-transform duration-300 ${isThisItemOpen ? "rotate-180" : ""}`}>
                                                    <Image src={icons.arrowData} width={16} height={16} alt="Toggle" />
                                                </div>
                                            </div>
                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-uppercase">
                                                {dk.documents?.length || 0} Files
                                            </span>
                                        </button>
                                    </div>

                                    {isThisItemOpen && (
                                        <div className="w-full flex flex-col gap-4">
                                            {dk.documents?.length > 0 ? (
                                                dk.documents.map((doc: any) => (
                                                    <div
                                                        key={doc.path}
                                                        className="flex justify-between items-center rounded-lg p-4 border border-(--color-border) shadow-sm hover:shadow-md transition-shadow bg-white"
                                                    >
                                                        <div className="flex flex-row gap-4">
                                                            <div className="w-20 h-20 bg-(--color-secondary) rounded-lg items-center justify-center relative">
                                                                <Image
                                                                    src={getFileIcon(doc)}
                                                                    fill
                                                                    alt="PDF Format"
                                                                    className="object-cover p-4"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col justify-center gap-1">
                                                                <p className="text-md font-bold">{doc.originalname}</p>
                                                                <p className="text-sm font-medium text-(--color-text-secondary)">{doc.filename}</p>
                                                                <span
                                                                    onClick={() => handlePreview(doc.path)}
                                                                    className="text-xs cursor-pointer hover:underline text-(--color-muted)"
                                                                >
                                                                    See File
                                                                </span>
                                                            </div>
                                                            {previewUrl && (
                                                                <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
                                                                    <div className="bg-white w-3/4 h-3/4 rounded-xl p-4 relative">
                                                                        <div className="items-center justify-between flex mb-5">
                                                                            <p className="text-md font-bold">{doc.originalname}</p>
                                                                            <button onClick={() => setPreviewUrl(null)} className="bg-(--color-primary) rounded-lg p-2 hover: hover:bg-red-800 cursor-pointer">
                                                                                <Image 
                                                                                    src={icons.closeMenu}
                                                                                    alt="Close Preview PDF"
                                                                                    width={24}
                                                                                    height={24}
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                        <iframe src={previewUrl} className="w-full h-[90%]" />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => handleDownload(doc.path, doc.filename)}
                                                            className="p-4 bg-(--color-primary) rounded-lg justify-center items-center cursor-pointer hover:bg-red-800"
                                                        >
                                                            <Image
                                                                src={icons.download}
                                                                alt="Download Button"
                                                                height={24}
                                                                width={24}
                                                            />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center text-(--color-muted) py-6 italic">
                                                    Belum ada Lampiran untuk kontrak ini.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    ) : (
                        <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                            <p className="text-gray-400 italic">Belum ada data kontrak tersedia.</p>
                        </div>
                    )}
                </div>
            </motion.div>
            {showModalEditPhoto && (
                <EditPhotoModal 
                    id={user.id} 
                    currentPhoto={previewPhoto || icons.userProfile} 
                    onClose={() => setShowModalEditPhoto(false)}
                    mutate={updatePhoto}
                    isPending={isPendingUpdate}
                />
            )}
            {/* {showModalEditUser && (
                <EditUserModal 
                    fetchedData={fetchedData}
                    onClose={() => setShowModalEditUser(false)}
                    mutate={updateDataUser}
                    isPending={isPendingUpdateUser}
                />
            )} */}
        </div>
    );
};

export default Profile;
