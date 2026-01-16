"use client";

import { useState } from "react";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import RekapitulasiAbsShows from "./RekapitulasiAbsShows";


const RekapitulasiAbsPage = () => {
    const renderHtml = (
        <div className="flex flex-col gap-4 pb-8 w-full">
            <div className="w-full bg-white rounded-2xl shadow-sm p-4 border border-slate-200">
                <div className="flex flex-col gap-4">
                    <RekapitulasiAbsShows showButton={true} buttonText="Butuh Peninjauan Reimburse" />
                </div>
            </div>
        </div>
    )

    return renderHtml;
}

export default RekapitulasiAbsPage;