"use client";

import AbsensiShows from "./AbsensiShows";

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