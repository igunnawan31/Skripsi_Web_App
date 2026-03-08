ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { COLORS } from "@/app/ui/colors";
import { useKpi } from "@/app/lib/hooks/kpi/useKpi";
import { StatusIndikatorKPI } from "@/app/lib/types/kpi/kpiTypes";
import { useUser } from "@/app/lib/hooks/user/useUser";
import { useKontrak } from "@/app/lib/hooks/kontrak/useKontrak";
import { MajorRole } from "@/app/lib/types/enumTypes";
import { useGaji } from "@/app/lib/hooks/gaji/useGaji";
import { GajiRequestProps } from "@/app/props/HRProps/GajiProps";
import { Gaji } from "@/app/lib/types/types";
import { SalaryStatus } from "@/app/lib/types/gaji/gajiTypes";

export const useGajiData = () => {
    const today = new Date();
    const defaultMonth = format(today, "yyyy-MM");

    const { data: gajiData, isLoading: isLoadingGaji, error: errorGaji } = useGaji().fetchAllSalaries({
        limit: 1000,
        minDueDate: startOfMonth(new Date(defaultMonth + "-01")).toISOString(),
        maxDueDate: endOfMonth(new Date(defaultMonth + "-01")).toISOString(),
    });

    const getWorkingDaysInMonth = (monthString: string) => {
        const [year, month] = monthString.split("-").map(Number);
        const start = startOfMonth(new Date(year, month - 1));
        const end = endOfMonth(new Date(year, month - 1));
        
        const allDays = eachDayOfInterval({ start, end });
        return allDays;
    };

    const workingDaysInMonth = getWorkingDaysInMonth(defaultMonth);

    const getDailyGajiStats = (day: Date) => {
        if (!gajiData?.data) return { paid: 0, pending: 0, overdue: 0, total: 0 };

        const dayStr = format(day, "yyyy-MM-dd");

        const active = gajiData.data.filter((c: any) => {
            const startStr = format(new Date(c.dueDate), "yyyy-MM-dd");
            return startStr === dayStr;
        });

        const paid = active.filter((c: any) => c.status === SalaryStatus.PAID).length;
        const pending = active.filter((c: any) => c.status === SalaryStatus.PENDING).length;
        const overdue = active.filter((c: any) => c.status === SalaryStatus.OVERDUE).length;

        return {
            active,
            paid,
            pending,
            overdue,
            total: gajiData.length
        };
    };

    const gajiStats = workingDaysInMonth.map(day => getDailyGajiStats(day));

    return {
        workingDaysInMonth,
        gajiStats,
        isLoadingGaji,
        gajiData,
        defaultMonth 
    }
}


export const GajiChart = ({ gajiStats, workingDays, isLoading }: any) => {
    const labels = workingDays.map((day: Date) => format(day, "dd MMM"));

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Paid',
                data: gajiStats.map((s: any) => s.paid),
                backgroundColor: `${COLORS.successOpa}`,
                borderColor: `${COLORS.success}`,
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: 'Pending',
                data: gajiStats.map((s: any) => s.pending),
                backgroundColor: `${COLORS.tertiaryOpa}`,
                borderColor: `${COLORS.tertiary}`,
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: 'Overdue',
                data: gajiStats.map((s: any) => s.overdue),
                backgroundColor: `${COLORS.primaryOpa}`,
                borderColor: `${COLORS.primary}`,
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: { usePointStyle: true, pointStyle: 'circle', padding: 20 }
            },
            tooltip: { 
                mode: 'index', 
                intersect: false,
                callbacks: {
                    footer: (items: any) => {
                        const total = items.reduce((a: number, b: any) => a + b.parsed.y, 0);
                        return `Total Gaji: ${total} orang`;
                    }
                }
            }
        },
        scales: {
            x: { stacked: true, grid: { display: false } },
            y: { 
                stacked: true, 
                beginAtZero: true, 
                ticks: { stepSize: 1, precision: 0 } 
            }
        },
    };

    if (isLoading) {
        return <div className="h-72 flex items-center justify-center animate-pulse bg-slate-50 rounded-lg">Loading Chart...</div>;
    }

    return (
        <div className="h-[350px] w-full">
            <Bar data={chartData} options={options} />
        </div>
    );
};