"use client";

import { useState } from "react";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import GajiShows from "./GajiShows";

const GajiPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const renderHtml = (
        <div className="flex flex-col gap-4 w-full">
            {/* <div className="grid grid-cols-2">
                <TableModal />
            </div> */}
            <div className="w-full bg-white rounded-2xl shadow-sm p-4 border border-slate-200">
                <div className="flex flex-col gap-4">
                    <SearchBar
                        placeholder="Cari karyawan..."
                        onSearch={handleSearch}
                    />
                    <GajiShows showButton={true} buttonText="Bayar Gaji Karyawan" />
                </div>
            </div>
        </div>
    )

    return renderHtml;
}

export default GajiPage;