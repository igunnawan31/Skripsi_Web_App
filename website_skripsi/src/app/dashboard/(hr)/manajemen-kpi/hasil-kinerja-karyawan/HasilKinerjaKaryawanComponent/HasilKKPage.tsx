"use client";

import { useState } from "react";
import SearchBar from "@/app/dashboard/dashboardComponents/allComponents/SearchBar";
import HasilKKList from "./HasilKKList";

const HasilKKPage = () => {
    const renderHtml = (
        <div className="flex flex-col gap-4 w-full">
            <div className="w-full bg-white rounded-2xl shadow-sm p-4 border border-slate-200">
                <div className="flex flex-col gap-4">
                    <HasilKKList />
                </div>
            </div>
        </div>
    )

    return renderHtml;
}

export default HasilKKPage;