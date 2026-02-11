"use client";

import ManajemenIndikatorList from "./ManajemenindikatorList";

const ManajemenIndikatorPage = () => {
    const renderHtml = (
        <div className="flex flex-col gap-4 w-full">
            <div className="w-full bg-white rounded-2xl shadow-sm p-4 border border-slate-200 mb-10">
                <div className="flex flex-col gap-4">
                    <ManajemenIndikatorList />
                </div>
            </div>
        </div>
    )

    return renderHtml;
}

export default ManajemenIndikatorPage;