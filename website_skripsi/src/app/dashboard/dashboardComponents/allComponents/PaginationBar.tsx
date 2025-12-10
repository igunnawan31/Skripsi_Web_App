"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";

interface PaginationBarProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (items: number) => void;
}

const PaginationBar: React.FC<PaginationBarProps> = ({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
    onItemsPerPageChange,
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const [inputPage, setInputPage] = useState(currentPage);

    useEffect(() => {
        setInputPage(currentPage);
    }, [currentPage]);

    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
            <div className="hidden sm:flex items-center space-x-2">
                <span className="text-gray-500 text-sm hidden sm:block">Items per Page</span>
                <select
                    className="border px-2 py-1 rounded-md bg-(--color-primary) text-white border-(--color-primary) hover:bg-(--color-primary) cursor-pointer"
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>

            <div className="hidden sm:block text-gray-500 text-sm">
                {itemsPerPage * (currentPage - 1) + 1} -{" "}
                {Math.min(itemsPerPage * currentPage, totalItems)} of {totalItems} items
            </div>

            <div className="flex justify-between sm:justify-center sm:items-center w-full sm:w-fit space-x-2">
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className={`px-2 py-1 border border-(--color-border) rounded-md flex items-center gap-2 ${
                        currentPage === 1 ? "text-gray-300" : "bg-(--color-primary) text-white border-(--color-primary) hover:bg-(--color-primary) cursor-pointer"
                    }`}
                >
                    {currentPage === 1 ? (
                        <Image 
                            src={icons.arrowLeftOff} 
                            width={20} 
                            height={20} 
                            alt={"Arrow Left Pagination"}
                            className={"transition-transform duration-300"} 
                        />
                    ) : (
                        <Image 
                            src={icons.arrowLeftActive} 
                            width={20} 
                            height={20} 
                            alt={"Arrow Left Pagination"}
                            className={"transition-transform duration-300"} 
                        />
                    )}
                    <div className="hidden md:block"> Previous</div>
                </button>
                <div className="flex gap-2 items-center justify-center">
                    <input
                        type="text"
                        className="border border-(--color-border) rounded-lg text-center w-8 h-8 active:ring-(--color-textPrimary)"
                        value={inputPage}
                        onChange={(e) => setInputPage(Number(e.target.value))}
                        onBlur={() => {
                            if (inputPage > 0 && inputPage <= totalPages) {
                                onPageChange(inputPage);
                            } else {
                                setInputPage(currentPage);
                            }
                        }}
                    />
                    <span className="text-gray-500 text-sm">of {totalPages}</span>
                </div>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className={`px-2 py-1 border border-(--color-border) rounded-md flex items-center gap-1 ${
                        currentPage === totalPages ? "text-gray-300" : "bg-(--color-primary) text-white border-(--color-primary) hover:bg-(--color-primary) cursor-pointer"
                    }`}
                >
                    <div className="hidden md:block">
                        Next
                    </div>
                    {currentPage === totalPages ? (
                        <Image 
                            src={icons.arrowRightOff} 
                            width={20} 
                            height={20} 
                            alt={"Arrow Left Pagination"}
                            className={"transition-transform duration-300"} 
                        />
                        
                    ) : (
                        <Image 
                            src={icons.arrowRightActive} 
                            width={20} 
                            height={20} 
                            alt={"Arrow Left Pagination"}
                            className={"transition-transform duration-300"} 
                        />
                    )}
                </button>
            </div>
        </div>
    );
};

export default PaginationBar;
