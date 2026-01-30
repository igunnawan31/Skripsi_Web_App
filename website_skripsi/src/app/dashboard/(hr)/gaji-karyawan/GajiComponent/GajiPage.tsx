"use client";

import GajiShows from "./GajiShows";

const GajiPage = () => {

    const renderHtml = (
        <div className="flex flex-col gap-4 w-full">
            <div className="w-full bg-white rounded-2xl shadow-sm p-4 border border-slate-200">
                <div className="flex flex-col gap-4">
                    <GajiShows showButton={true} buttonText="Bayar Gaji Karyawan" />
                </div>
            </div>
        </div>
    )

    return renderHtml;
}

export default GajiPage;