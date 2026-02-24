"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useGaji } from "@/app/lib/hooks/gaji/useGaji";
import { SalaryResponse, SalaryStatus } from "@/app/lib/types/gaji/gajiTypes";
import { format, parseISO } from "date-fns";

const GajiData = ({ selectedBulan }: { selectedBulan: string }) => {
    const getMonthRange = (monthString: string) => {
        if (!monthString) return { min: undefined, max: undefined };
        const [year, month] = monthString.split('-').map(Number);
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0, 23, 59, 59);
        return {
            min: firstDay.toISOString(),
            max: lastDay.toISOString()
        };
    };

    const { min: monthMin, max: monthMax } = getMonthRange(selectedBulan);

    const { data } = useGaji().fetchAllSalaries({
        page: 1,
        limit: 1000,
        minDueDate: monthMin,
        maxDueDate: monthMax,
    });

    const stats = useMemo(() => {
        const salaries: SalaryResponse[] = data?.data || [];
        const today = new Date();

        const calculateAmount = (list: SalaryResponse[]) => 
            list.reduce((acc, curr) => acc + (curr.amount || 0), 0);

        const paidSalaries = salaries.filter(s => s.status === SalaryStatus.PAID);
        const pendingSalaries = salaries.filter(s => 
            s.status === SalaryStatus.PENDING && new Date(s.dueDate) >= today
        );
        const overdueSalaries = salaries.filter(s => 
            s.status === SalaryStatus.OVERDUE || 
            (s.status === SalaryStatus.PENDING && new Date(s.dueDate) < today)
        );

        return [
            { 
                id: 1, 
                label: "Total Data Gaji", 
                count: salaries.length, 
                amount: calculateAmount(salaries),
                color: "bg-blue-100 text-blue-700" 
            },
            { 
                id: 2, 
                label: "Gaji Sudah Dibayar", 
                count: paidSalaries.length, 
                amount: calculateAmount(paidSalaries),
                color: "bg-emerald-100 text-emerald-700" 
            },
            { 
                id: 3, 
                label: "Gaji Menunggu", 
                count: pendingSalaries.length, 
                amount: calculateAmount(pendingSalaries),
                color: "bg-amber-100 text-amber-700" 
            },
            { 
                id: 4, 
                label: "Gaji Terlambat (Overdue)", 
                count: overdueSalaries.length, 
                amount: calculateAmount(overdueSalaries),
                color: "bg-red-100 text-red-700" 
            }
        ];
    }, [data]);

    const formatIDR = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="relative w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((item) => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all relative flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${item.color}`}>
                                    {item.label}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-4xl font-bold text-slate-800">
                                    {item.count} <span className="text-sm font-normal text-slate-400">Data</span>
                                </h3>
                                <p className="text-lg font-semibold text-slate-600 mt-1">
                                    {formatIDR(item.amount)}
                                </p>
                            </div>
                        </div>
                        
                        <p className="text-xs text-slate-500 mt-3">
                            Periode: {format(parseISO(`${selectedBulan}-01`), "MMMM yyyy")}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default GajiData;