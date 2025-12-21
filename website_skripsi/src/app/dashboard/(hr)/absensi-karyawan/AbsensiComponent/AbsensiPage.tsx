"use client";

import { useState } from "react";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import AbsensiShows from "./AbsensiShows";
import TableModal from "@/app/dashboard/dashboardComponents/TableModal";
import FilterBar from "@/app/dashboard/dashboardComponents/allComponents/FilterBar";
import GrafikBar from "@/app/dashboard/dashboardComponents/allComponents/GrafikBar";

const AbsensiKaryawanPage = () => {
    const renderHtml = (
        <div className="flex flex-col gap-4 w-full">
            <div className="w-full bg-white rounded-2xl shadow-sm p-4 border border-slate-200">
                <div className="flex flex-col gap-4">
                    <AbsensiShows showButton={true} buttonText="Cek Absensi Disini" />
                </div>
            </div>
        </div>
    )

    return renderHtml;
}

export default AbsensiKaryawanPage;