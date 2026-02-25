"use client";

import { motion } from "framer-motion";
import KontrakKerjaShows from "./KontrakKerjaShows";
import KontrakKerjaData from "./KontrakKerjaData";

const KontrakKerjaPage = () => {
    const renderHtml = (
        <div className="flex flex-col gap-4 pb-8 w-full">
            <div className="w-full">
                <KontrakKerjaData />
            </div>
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all relative"
            >
                <div className="flex flex-col gap-4">
                    <KontrakKerjaShows />
                </div>
            </motion.div>
        </div>
    )

    return renderHtml;
}

export default KontrakKerjaPage;