"use client";

import { icons } from "@/app/lib/assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type ConfirmationPopUpModalProps = {
    isOpen: boolean;
    onAction: () => void;
    onClose: () => void;
    type?: "success" | "error" | "info";
    title?: string;
    message?: string;
    activeText?: string;
    passiveText?: string;
    isLoading?: boolean;
    isSuccess?: boolean;
    isError?: boolean;
    errorMessage?: string;
    titleMessage?: string;
};

const ConfirmationPopUpModal = ({
    isOpen,
    onAction,
    onClose,
    type,
    title,
    message,
    activeText,
    passiveText,
    isLoading = false,
    isSuccess = false,
    isError = false,
    errorMessage,
    titleMessage,
}: ConfirmationPopUpModalProps) => {
    const cardVariants = {
        initial: { opacity: 0, scale: 0.9, y: 10 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: -10 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <AnimatePresence mode="wait">
                        {isLoading && (
                            <motion.div
                                key="loading-card"
                                variants={cardVariants}
                                initial="initial" 
                                animate="animate" 
                                exit="exit"
                                className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full flex flex-col items-center gap-4"
                            >
                                <div className="w-20 h-20 border-4 border-gray-100 border-t-(--color-success) rounded-full animate-spin"></div>
                                <div className="text-center">
                                    <h3 className="text-lg font-bold text-gray-800">Menyimpan Data</h3>
                                    <p className="text-sm text-gray-500">Mohon tunggu sebentar...</p>
                                </div>
                            </motion.div>
                        )}
                        {isSuccess && (
                            <motion.div
                                key="success-card"
                                variants={cardVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full flex flex-col items-center gap-4 border-t-4 border-(--color-success)"
                            >
                                <div className="bg-green-100 p-4 rounded-full">
                                    <Image 
                                        src={icons.successPop} 
                                        alt="success" 
                                        width={60} 
                                        height={60} 
                                    />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-gray-800">{titleMessage ? titleMessage : "Berhasil Dibuat!"}</h3>
                                    <p className="text-sm text-gray-500 mt-2">Data Anda telah tersimpan. Mengalihkan halaman...</p>
                                </div>
                            </motion.div>
                        )}
                        {isError && !isLoading && (
                            <motion.div
                                key="error-card"
                                variants={cardVariants}
                                initial="initial" 
                                animate="animate" 
                                exit="exit"
                                className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full flex flex-col items-center gap-4 border-t-4 border-(--color-primary)"
                            >
                                <div className="bg-red-100 p-4 rounded-full">
                                    <Image 
                                        src={icons.errorPop} 
                                        alt="error" 
                                        width={60} 
                                        height={60} 
                                    />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-gray-800">Terjadi Kesalahan</h3>
                                    <p className="text-sm text-gray-500 mt-2">{errorMessage || "Gagal menyimpan data. Silakan coba lagi."}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-full mt-2 px-4 py-2 bg-(--color-primary) text-white font-bold rounded-xl hover:bg-red-700 transition-all cursor-pointer"
                                >
                                    Tutup & Perbaiki
                                </button>
                            </motion.div>
                        )}
                        {!isLoading && !isSuccess && !isError && (
                            <motion.div
                                key="confirm-card"
                                variants={cardVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="flex flex-col gap-4 max-w-sm w-full"
                            >
                                <div className="bg-white rounded-2xl p-6 shadow-xl text-center flex flex-col items-center">
                                    <div className={`p-4 rounded-xl mb-4 
                                        ${type === 'success' ? 
                                        'bg-green-50' : 
                                        'bg-blue-50'}`
                                    }>
                                        <Image 
                                            src={type === "success" ? 
                                                icons.successPop : 
                                                icons.infoPop
                                            } 
                                            alt="icon" 
                                            width={50} 
                                            height={50} 
                                        />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                                    <p className="text-gray-500 mt-2 text-sm">{message}</p>
                                </div>
                                <div className="bg-white rounded-2xl p-4 shadow-lg flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                                    >
                                        {passiveText}
                                    </button>
                                    <button
                                        onClick={onAction}
                                        className="flex-2 px-4 py-3 bg-(--color-success) text-white font-bold rounded-xl hover:shadow-lg hover:shadow-green-200 transition-all cursor-pointer active:scale-95"
                                    >
                                        {activeText}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationPopUpModal;