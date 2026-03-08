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

export const useIndikatorData = () => {
    const today = new Date();
    const defaultMonth = format(today, "yyyy-MM");

    const { data: indikatorData, isLoading: isLoadingIndikator, error: errorIndikator } = useKpi().fetchAllIndikator({
        limit: 1000,
        status: StatusIndikatorKPI.ACTIVE,
        minStartDate: startOfMonth(new Date(defaultMonth + "-01")).toISOString(),
        maxEndDate: endOfMonth(new Date(defaultMonth + "-01")).toISOString(),
    });

    const getWorkingDaysInMonth = (monthString: string) => {
        const [year, month] = monthString.split("-").map(Number);
        const start = startOfMonth(new Date(year, month - 1));
        const end = endOfMonth(new Date(year, month - 1));
        
        const allDays = eachDayOfInterval({ start, end });
        return allDays;
    };

    const workingDaysInMonth = getWorkingDaysInMonth(defaultMonth);

    const getDailyIndikatorStats = (day: Date) => {
        if (!indikatorData?.data) return { active: 0, total: 0 };

        const dayStr = format(day, "yyyy-MM-dd");

        const active = indikatorData.data.filter((c: any) => {
            const startStr = format(new Date(c.startDate), "yyyy-MM-dd");
            return c.status === StatusIndikatorKPI.ACTIVE && startStr === dayStr;
        }).length;

        return {
            active,
            total: active
        };
    };

    const indikatorStats = workingDaysInMonth.map(day => getDailyIndikatorStats(day));

    return {
        workingDaysInMonth,
        indikatorStats,
        isLoadingIndikator,
        indikatorData,
        defaultMonth 
    }
}


export const IndikatorChart = ({ indikatorStats, workingDays, isLoading }: any) => {
    const labels = workingDays.map((day: Date) => format(day, "dd MMM"));

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Active',
                data: indikatorStats.map((s: any) => s.active),
                backgroundColor: `${COLORS.successOpa}`,
                borderColor: `${COLORS.success}`,
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
                        return `Total Indikator Aktif: ${total}`;
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