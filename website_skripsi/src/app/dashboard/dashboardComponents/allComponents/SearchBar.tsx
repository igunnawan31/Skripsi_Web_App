"use client";

import { useState } from "react";

interface SearchBarProps {
    placeholder?: string;
    onSearch: (query: string) => void;
}

const SearchProducts: React.FC<SearchBarProps> = ({
    placeholder = "Search...",
    onSearch,
}) => {
    const [query, setQuery] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    };

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                className="w-full h-12 px-4 pr-24 text-sm rounded-lg border border-slate-200 shadow-sm outline-none font-sans focus:ring-2 focus:ring-[--color-primary]"
                placeholder={placeholder}
                value={query}
                onChange={handleChange}
            />
            <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-(--color-primary) text-(--color-surface) text-sm font-medium px-4 py-2 rounded-lg cursor-pointer"
            >
                Search
            </button>
        </div>
    );
};

export default SearchProducts;
