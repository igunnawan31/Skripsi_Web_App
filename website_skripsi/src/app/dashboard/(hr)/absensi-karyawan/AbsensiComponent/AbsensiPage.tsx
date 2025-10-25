"use client";

import { useState } from "react";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import TableModal from "@/app/dashboard/dashboardComponents/TableModal";
import FilterBar from "@/app/dashboard/dashboardComponents/allComponents/FilterBar";
import GrafikBar from "@/app/dashboard/dashboardComponents/allComponents/GrafikBar";

const AbsensiKaryawanPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const renderHtml = (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2">
                <TableModal />
            </div>
            <SearchBar
                placeholder="Cari karyawan..."
                onSearch={handleSearch}
            />
        </div>
    )

    return renderHtml;
}

export default AbsensiKaryawanPage;