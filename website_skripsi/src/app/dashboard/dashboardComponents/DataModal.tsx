"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import DashboardData from "@/app/lib/dummyData/DashboardData";


const DataModal = () => {
    const [selected, setSelected] = useState(DashboardData.slice(0, 4));
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [filters, setFilters] = useState<Record<number, string>>({});

    const handleCheckboxChange = (item: typeof DashboardData[0]) => {
        const isChecked = selected.some((d) => d.id === item.id);
        if (isChecked) {
            setSelected(selected.filter((d) => d.id !== item.id));
        } else if (selected.length < 4) {
            setSelected([...selected, item]);
        }
    };

    const handleFilterChange = (id: number, value: string) => {
        setFilters((prev) => ({ ...prev, [id]: value }));
    };

    const renderHtml = (
        <div className="relative w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Ringkasan HRIS</h2>
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 border border-slate-300 px-3 py-1.5 rounded-lg text-sm hover:bg-slate-100 cursor-pointer"
                    >
                        Pilih Data
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-10">
                            {DashboardData.map((item) => {
                                const isChecked = selected.some((d) => d.id === item.id);
                                return (
                                    <label
                                        key={item.id}
                                        className={`flex items-center gap-2 px-2 py-1 rounded-md hover:bg-slate-50 text-sm cursor-pointer ${
                                            selected.length >= 4 && !isChecked ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            disabled={selected.length >= 4 && !isChecked}
                                            onChange={() => handleCheckboxChange(item)}
                                        />
                                        {item.label}
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {selected.map((item) => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all relative"
                    >
                        <div className="absolute right-3 top-3">
                            <select
                                value={filters[item.id] || "1w"}
                                onChange={(e) => handleFilterChange(item.id, e.target.value)}
                                className="text-xs border border-slate-300 rounded-md px-2 py-1 bg-white focus:outline-none"
                            >
                                <option value="1w">1 Week</option>
                                <option value="1m">1 Month</option>
                                <option value="1y">1 Year</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.color}`}>
                                {item.label}
                            </span>
                            <span className="text-xs text-green-600 font-medium">{item.change}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">{item.value}</h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Data HRIS {item.label} ({filters[item.id] === "1m" ? "Bulan ini" : filters[item.id] === "1y" ? "Tahun ini" : "Minggu ini"})
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    return renderHtml;
}

export default DataModal;