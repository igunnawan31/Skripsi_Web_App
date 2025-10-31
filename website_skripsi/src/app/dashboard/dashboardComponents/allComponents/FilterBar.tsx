"use client";

import React from "react";

interface FilterDropdownProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    className?: string;
}

const FilterBar: React.FC<FilterDropdownProps> = ({
    label,
    value,
    onChange,
    options,
    className = "",
}) => {
    return (
        <div
            className={`flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto ${className}`}
        >
            <label className="text-sm font-medium text-(--color-text-secondary)">
                {label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="border border-(--color-border) rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FilterBar;
