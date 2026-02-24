"use client";

import CutiData from "./CutiData";
import CutiShows from "./CutiShows";
import { motion } from "framer-motion";

const CutiPage = () => {
    const renderHtml = (
        <div className="flex flex-col gap-4 pb-8 w-full">
            <div className="w-full">
                <CutiData />
            </div>
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all relative"
            >
                <div className="flex flex-col gap-4">
                    <CutiShows showButton={true} buttonText="Butuh Peninjauan Cuti" />
                </div>
            </motion.div>
        </div>
    )

    return renderHtml;
}

export default CutiPage;