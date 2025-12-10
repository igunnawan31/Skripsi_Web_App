import { icons } from "@/app/lib/assets/assets";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type FilterField = {
    key: string;
    label: string;
    type: "text" | "date" | "select";
    options?: string[];
};

type FilterModalProps = {
    isOpen: boolean;
    filterFields: FilterField[];
    initialValues: Record<string, string>;
    onClose: () => void;
    onApply: (filters: Record<string, string | undefined>) => void;
};

export default function FilterModal({
    isOpen,
    filterFields,
    initialValues,
    onClose,
    onApply,
}: FilterModalProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [values, setValues] = useState<Record<string, string>>(initialValues);

    useEffect(() => {
        setValues(initialValues);
    }, [initialValues]);

    useEffect(() => {
        const handleOutside = (e: MouseEvent) => {
            if (!isOpen) return;
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleReset = () => {
        const resetValues: Record<string, string> = {};
        filterFields.forEach((field) => {
            resetValues[field.key] = field.type === "select" ? "All" : "";
        });
        setValues(resetValues);
    };

    const handleApply = () => {
        const appliedFilters: Record<string, string | undefined> = {};
        filterFields.forEach((field) => {
            const value = values[field.key];
            appliedFilters[field.key] = value && value !== "All" ? value : undefined;
        });
        onApply(appliedFilters);
        onClose();
    };

    const handleChange = (key: string, value: string) => {
        setValues((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="absolute sm:left-24 sm:top-18 top-28 z-50">
            {/* <div className="fixed inset-0 bg-opacity-25"></div> */}
            <div
                ref={ref}
                className="relative z-50 w-full min-w-68 sm:min-w-sm bg-(--color-surface) border border-(--color-border) rounded-lg shadow-lg p-4 transform transition-all"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center justify-between mb-4 border-b pb-2 border-(--color-border)">
                    <h3 className="text-md">Filter</h3>
                    <div
                        className="p-2 rounded-lg bg-(--color-primary) hover:bg-(--color-primary)/80 cursor-pointer transition"
                        onClick={onClose}
                    >
                        <Image
                            src={icons.closeMenu}
                            alt="Close Filter"
                            width={24}
                            height={24}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {filterFields.map((field) => (
                        <div key={field.key}>
                            <label className="block text-xs font-medium text-(--color-text-secondary)">
                                {field.label}
                            </label>
                            {field.type === "text" && (
                                <input
                                    type="text"
                                    value={values[field.key] || ""}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border border-(--color-border) rounded-md bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) cursor-pointer"
                                />
                            )}
                            {field.type === "date" && (
                                <input
                                    type="date"
                                    value={values[field.key] || ""}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border border-(--color-border) rounded-md bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) cursor-pointer"
                                />
                            )}
                            {field.type === "select" && (
                                <select
                                    value={values[field.key] || "All"}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border border-(--color-border) rounded-md bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) cursor-pointer"
                                >
                                    <option value="All">All</option>
                                    {field.options?.map((option) => (
                                        <option key={option} value={option}>
                                            {option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    ))}

                    <div className="flex w-full justify-between gap-2 mt-2 border-t border-(--color-border) pt-3">
                        <button
                            onClick={handleReset}
                            className="flex items-center justify-center px-4 py-2 border border-(--color-border) rounded-md text-sm text-(--color-text-secondary) cursor-pointer hover:underline"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleApply}
                            className="flex items-center justify-center px-4 py-2 bg-(--color-primary) text-white rounded-md text-sm cursor-pointer hover:underline"
                        >
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
