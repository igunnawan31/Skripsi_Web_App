"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import AbsensiShows from "./AbsensiShows";
import AbsensiData from "./AbsensiData";

const AbsensiKaryawanPage = () => {
    const searchParams = useSearchParams();
    const today = new Date().toISOString().split("T")[0];
    
    const [selectedDate, setSelectedDate] = useState<string>(
        searchParams.get("date") || today
    );

    return (
        <div className="flex flex-col gap-4 pb-8 w-full">
            <div className="w-full">
                <AbsensiData selectedDate={selectedDate} />
            </div>
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all relative"
            >
                <div className="flex flex-col gap-4">
                    <AbsensiShows 
                        showButton={true} 
                        buttonText="Cek Absensi Disini" 
                        externalDate={selectedDate}
                        onDateChange={setSelectedDate}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default AbsensiKaryawanPage;