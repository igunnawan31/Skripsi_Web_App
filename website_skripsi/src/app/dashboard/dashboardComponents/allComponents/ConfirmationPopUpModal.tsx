"use client";

import { icons } from "@/app/lib/assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type ConfirmationPopUpModalProps = {
    isOpen: boolean;
    onAction: () => void;
    onClose: () => void;
    type?: "success" | "error" | "info";
    image?: string;
    title?: string;
    message?: string;
    showButton?: boolean;
    activeText?: string;
    passiveText?: string;
};

const ConfirmationPopUpModal = ({
    isOpen,
    onAction,
    onClose,
    type,
    image,
    title,
    message,
    showButton = true,
    activeText,
    passiveText,
}: ConfirmationPopUpModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full text-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="w-full flex flex-col justify-center items-center gap-2">
                            {type === "success" ? (
                                <div className="flex justify-center w-fit p-4 bg-(--color-success)/30 rounded-lg mb-6">
                                    <Image src={icons.successPop} alt="icon" width={60} height={60} />
                                </div>
                            ) : type === "error" ? (
                                <div className="flex justify-center w-fit p-4 bg-(--color-primary)/30 rounded-lg mb-6">
                                    <Image src={icons.errorPop} alt="icon" width={60} height={60} />
                                </div>
                            ) : (
                                <div className="flex justify-center w-fit p-4 bg-(--color-info)/30 rounded-lg mb-6">
                                    <Image src={icons.infoPop} alt="icon" width={50} height={50} />
                                </div>
                            )}
                            <div className="flex flex-col mb-8">
                                <h2 className="text-xl font-bold">{title}</h2>
                                <p className="text-(--color-muted)">{message}</p>
                            </div>

                            {showButton && (
                                <div className="w-full flex justify-between gap-4">
                                    <button
                                        onClick={onAction}
                                        className="w-full px-4 py-2 bg-(--color-success) text-white font-bold rounded-lg hover:bg-green-600 cursor-pointer"
                                    >
                                        {activeText}   
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="w-full px-4 py-2 bg-(--color-surface) border border-(--color-border) rounded-lg hover:border-(--color-primary) cursor-pointer"
                                    >
                                        {passiveText}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationPopUpModal;
