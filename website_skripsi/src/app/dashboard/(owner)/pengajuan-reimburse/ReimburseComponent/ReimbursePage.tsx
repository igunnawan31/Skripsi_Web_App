"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ReimburseShows from "./ReimburseShows";
import { useSearchParams } from "next/navigation";
import ReimburseData from "./ReimburseData";


const ReimbursePage = () => {
    const searchParams = useSearchParams();
    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const [selectedBulan, setSelectedBulan] = useState(searchParams.get("bulan") || currentYearMonth);

    const renderHtml = (
        <div className="flex flex-col gap-4 pb-8 w-full">
            <div className="w-full">
                <ReimburseData selectedBulan={selectedBulan} />
            </div>
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all relative"
            >
                <div className="flex flex-col gap-4">
                    <ReimburseShows 
                        showButton={true} 
                        buttonText="Butuh Peninjauan Reimburse"
                        externalBulan={selectedBulan} 
                        onBulanChange={setSelectedBulan} 
                    />
                </div>
            </motion.div>
        </div>
    )

    return renderHtml;
}

export default ReimbursePage;