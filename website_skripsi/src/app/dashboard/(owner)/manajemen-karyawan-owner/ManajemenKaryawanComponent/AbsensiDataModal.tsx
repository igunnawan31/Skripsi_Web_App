"use client";

import { useEffect, useMemo, useState } from "react";
import FilterModal from "@/app/dashboard/dashboardComponents/allComponents/FilterModal";
import { calculateAttendanceAdvanced } from "@/app/lib/utils/CalculateAbsensi";
import { getMonthsFromContract, getYearsFromContract } from "@/app/lib/utils/DateRange";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";

type Props = {
    absensi: any[];
    kontrak: {
        absensiBulanan: number;
        startDate: string;
        endDate: string;
    };
};

const MONTH_NAMES_ID = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("id-ID", { month: "long" })
);

function monthNameToIndex(monthName?: string) {
    if (!monthName) return undefined;
    return MONTH_NAMES_ID.findIndex(
        (m) => m.toLowerCase() === monthName.toLowerCase()
    );
}

export default function AttendanceDataModal({ absensi, kontrak }: Props) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const now = new Date();
    const [filters, setFilters] = useState<{
        mode: "month" | "year";
        year: string;
        month?: string;
    }>({
        mode: "month",
        year: String(now.getFullYear()),
        month: MONTH_NAMES_ID[now.getMonth()],
    });
    const [filtersCuti, setFiltersCuti] = useState<{
        mode: "month" | "year";
        year: string;
        month?: string;
    }>({
        mode: "month",
        year: String(now.getFullYear()),
        month: MONTH_NAMES_ID[now.getMonth()],
    });

    const availableYears = useMemo(() => {
        if (!kontrak?.startDate || !kontrak?.endDate) return [];
        return getYearsFromContract(kontrak.startDate, kontrak.endDate);
    }, [kontrak.startDate, kontrak.endDate]);

    const availableMonths = useMemo(() => {
        if (!kontrak?.startDate || !kontrak?.endDate) return [];
        return getMonthsFromContract(
            Number(filters.year),
            kontrak.startDate,
            kontrak.endDate
        );
    }, [filters.year, kontrak.startDate, kontrak.endDate]);

    useEffect(() => {
        if (!availableYears.length) return;

        const yearNum = Number(filtersCuti.year);

        if (!availableYears.includes(yearNum)) {
            setFiltersCuti((prev) => ({
                ...prev,
                year: String(availableYears[0]),
            }));
        }
    }, [availableYears, filtersCuti.year]);

    useEffect(() => {
        if (!availableYears.length) return;

        const yearNum = Number(filters.year);

        if (!availableYears.includes(yearNum)) {
            setFilters((prev) => ({
                ...prev,
                year: String(availableYears[0]),
            }));
        }
    }, [availableYears, filters.year]);

    useEffect(() => {
        if (filters.mode !== "month" || !availableMonths.length) return;

        const currentMonthIndex = monthNameToIndex(filters.month);

        if (
            currentMonthIndex === undefined ||
            !availableMonths.includes(currentMonthIndex)
        ) {
            setFilters((prev) => ({
                ...prev,
                month: MONTH_NAMES_ID[availableMonths[0]],
            }));
        }
    }, [availableMonths, filters.mode, filters.month]);

    useEffect(() => {
        if (filtersCuti.mode !== "month" || !availableMonths.length) return;

        const currentMonthIndex = monthNameToIndex(filtersCuti.month);

        if (
            currentMonthIndex === undefined ||
            !availableMonths.includes(currentMonthIndex)
        ) {
            setFilters((prev) => ({
                ...prev,
                month: MONTH_NAMES_ID[availableMonths[0]],
            }));
        }
    }, [availableMonths, filtersCuti.mode, filtersCuti.month]);

    const filterFields = useMemo(() => {
        const fields: any[] = [
            {
                key: "mode",
                label: "Periode",
                type: "select",
                options: ["month", "year"],
            },
            {
                key: "year",
                label: "Tahun",
                type: "select",
                options: availableYears.map(String),
            },
        ];
        if (filters.mode === "month") {
            fields.push({
                key: "month",
                label: "Bulan",
                type: "select",
                options: availableMonths.map(
                    (m) => MONTH_NAMES_ID[m]
                ),
            });
        };
        return fields;
    }, [filters.mode, availableYears, availableMonths]);

    const result = useMemo(() => {
        const monthIndex =
            filters.mode === "month"
            ? monthNameToIndex(filters.month)
            : undefined;

        return calculateAttendanceAdvanced(
            absensi,
            kontrak,
            filters.mode,
            Number(filters.year),
            monthIndex
        );
    }, [absensi, kontrak, filters]);

    useEffect(() => {
        if (filters.mode === "year" && filters.month !== undefined) {
            setFilters((prev) => {
                const { month, ...rest } = prev;
                return rest;
            });
        }
    }, [filters.mode]);

    useEffect(() => {
        if (
            filters.mode === "month" &&
            filters.month === undefined &&
            availableMonths.length
        ) {
            setFilters((prev) => ({
                ...prev,
                month: MONTH_NAMES_ID[availableMonths[0]],
            }));
        }
    }, [filters.mode, filters.month, availableMonths]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-4">
                <div
                    onClick={() => setIsFilterOpen((v) => !v)}
                    className="group px-4 py-2 bg-(--color-surface) border border-(--color-border) rounded-lg text-sm font-medium text-(--color-textPrimary) hover:bg-(--color-primary) hover:text-(--color-surface) transition cursor-pointer flex items-center gap-2"
                >
                    <Image
                        src={icons.filterBlack}
                        alt="Filter Icon"
                        width={16}
                        height={16}
                        className="block group-hover:hidden"
                    />
                    <Image
                        src={icons.filterWhite}
                        alt="Filter Icon"
                        width={16}
                        height={16}
                        className="hidden group-hover:block"
                    />
                    Filter
                </div>
            </div>

            <div className="bg-(--color-surface) rounded-xl border border-slate-200 p-4 w-1/3">
                <p className="text-sm text-slate-500 mb-1">{result.label}</p>
                <h3 className="text-3xl font-bold">
                    {result.hadir}/{result.target}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                    Kehadiran berdasarkan absensi harian
                </p>
            </div>

            <FilterModal
                isOpen={isFilterOpen}
                filterFields={filterFields}
                initialValues={filters}
                onClose={() => setIsFilterOpen(false)}
                onApply={(applied) => {
                    setFilters((prev) => ({
                        ...prev,
                        ...applied,
                    }));
                }}
                enableAllOption={false}
                className="absolute sm:left-24 z-50"
            />
        </div>
    );
}
