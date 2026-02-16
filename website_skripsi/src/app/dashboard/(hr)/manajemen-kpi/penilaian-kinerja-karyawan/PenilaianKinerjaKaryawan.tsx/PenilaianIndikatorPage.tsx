"use client";

import { useState } from "react";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import PenilaianIndikatorList from "./PenilaianIndikatorList";

const PenilaianIndikatorPage = () => {
    const renderHtml = (
        <div className="flex flex-col gap-4 w-full">
            <div className="w-full bg-white rounded-2xl shadow-sm p-4 border border-slate-200 mb-10">
                <div className="flex flex-col gap-4">
                    <PenilaianIndikatorList showButton={true} buttonText="Butuh Peninjauan Penilaian" />
                </div>
            </div>
        </div>
    )

    return renderHtml;
}

export default PenilaianIndikatorPage;