"use client";

import { useState } from "react";
import { employeeData } from "@/app/lib/dummyData/EmployeeData";
import DashboardData from "@/app/lib/dummyData/DashboardData";
import { motion } from "framer-motion";

interface TableModalProps {
    
}

const TableModal = () => {
    const [selected, setSelected] = useState(DashboardData[0]);
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const handleSelect = (item: typeof DashboardData[0]) => {
        setSelected(item);
        setDropdownOpen(false);
    };

    const currentData = employeeData[selected.label] || { columns: [], rows: [] };

    const renderHtml = (
        <motion.section 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-slate-800">{selected.label}</h2>
                    <p className="text-xs text-slate-500 line-clamp-2">
                        Menampilkan data terkait kategori {selected.label.toLowerCase()}.
                    </p>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 border border-slate-300 px-3 py-1.5 rounded-lg text-sm hover:bg-slate-100 cursor-pointer"
                    >
                        Pilih Data
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-10">
                            {DashboardData.map((item) => (
                                <label
                                    key={item.id}
                                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-slate-50 text-sm cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="dataOption"
                                        checked={selected.id === item.id}
                                        onChange={() => handleSelect(item)}
                                    />
                                    {item.label}
                                </label>
                            ))}
                        </div>
                    )}  
                </div>
            </div>

            <div className="overflow-x-auto mt-4">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr>
                        {currentData.columns.map((col, idx) => (
                            <th
                                key={idx}
                                className="border-b border-slate-200 px-4 py-2 text-left text-sm font-medium text-slate-600"
                            >
                                {col}
                            </th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.rows.slice(0, 5).map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                                {currentData.columns.map((col, cIdx) => (
                                    <td
                                        key={cIdx}
                                        className="border-b border-slate-100 px-4 py-2 text-sm text-slate-700"
                                    >
                                        {row[col] || "-"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.section>
    );

    return renderHtml;
};

export default TableModal;