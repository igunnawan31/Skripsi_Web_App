"use client";

import { motion } from "framer-motion";
import RekapitulasiCutiShows from "./RekapitulasiCutiShows";

const RekapitulasiCutiPage = () => {
    return (
        <div className="flex flex-col gap-4 pb-8 w-full">
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all relative"
            >
                <div className="flex flex-col gap-4">
                    <RekapitulasiCutiShows />
                </div>
            </motion.div>
        </div>
    );
};

export default RekapitulasiCutiPage;