import { icons } from "@/app/lib/assets/assets";
import CustomToast from "@/app/rootComponents/CustomToast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const EditPhotoModal = ({ id, currentPhoto, isPending, onClose, mutate }: any) => {
    const router = useRouter();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState(currentPhoto);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = () => {
        if (!selectedFile) return;
        
        mutate({ id, photo: selectedFile }, {
            onSuccess: () => {
                toast.custom(
                    <CustomToast 
                        type="success" 
                        message="Foto profil berhasil diperbarui" 
                    />
                );
                onClose();
                
                setTimeout(() => {
                    router.refresh();
                }, 500);
            },
            onError: (error: any) => {
                toast.custom(
                    <CustomToast 
                        type="error" 
                        message={error.message || "Gagal memperbarui foto profil"} 
                    />
                );
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 mx-6 rounded-xl max-w-md flex flex-col items-center gap-4">
                <h3 className="font-semibold">Edit Profile Photo</h3>
                <div className="w-1/2 h-1/2 rounded-full overflow-hidden border-2 border-yellow-600">
                    <img src={preview} className="w-full h-full object-cover" />
                </div>
                <div className="w-full border border-(--color-border) p-4 flex justify-between items-center rounded-lg">
                    <input
                        type="file"
                        id="fileUpload"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    {selectedFile ? (
                        <p className="text-xs">
                            Selected: {selectedFile.name}
                        </p>
                    ) : (
                        <p className="text-xs">
                            Format: JPG, PNG, atau WEBP (Maks. 2MB)
                        </p>
                    )}
                    <label
                        htmlFor="fileUpload"
                        className="text-sm rounded-lg text-(--color-surface) bg-(--color-primary) p-2 cursor-pointer"
                    >
                        {selectedFile ? "Change" : "Upload"}
                    </label>
                </div>
                <div className="flex gap-2 w-full justify-between mt-4">
                    <button
                        type="button" 
                        onClick={onClose} 
                        className="px-5 py-2 rounded-lg border border-(--color-border) text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                    >
                        Batal
                    </button>
                    <button 
                        type="button"
                        onClick={handleSave}
                        disabled={isPending}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white transition
                            ${isPending
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-yellow-500 hover:bg-yellow-600 active:scale-[0.98]  cursor-pointer"
                            }`}
                    >
                        <Image src={icons.saveLogo} alt="Save Logo" width={18} height={18} />
                        {isPending ? "Menyimpan..." : "Simpan Profile Photo"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPhotoModal;