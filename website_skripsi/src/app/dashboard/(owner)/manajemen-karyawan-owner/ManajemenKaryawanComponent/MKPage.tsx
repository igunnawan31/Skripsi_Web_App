"use client";

import { motion } from "framer-motion";
import MKShows from "./MKShows";

const MKPage = () => {
    const renderHtml = (
        <div className="flex flex-col gap-4 w-full">
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all relative"
            >
                <div className="flex flex-col gap-4">
                    <MKShows />
                </div>
            </motion.div>
        </div>
    )

    return renderHtml;
}

export default MKPage;