ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

import { eachDayOfInterval, endOfMonth, format, isWeekend, startOfMonth } from "date-fns";
import { useUser } from "@/app/lib/hooks/user/useUser";
import { useKontrak } from "@/app/lib/hooks/kontrak/useKontrak";
import { CutiStatus, MajorRole } from "@/app/lib/types/enumTypes";
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
import { toZonedTime } from "date-fns-tz";
import { COLORS } from "@/app/ui/colors";
import { useCuti } from "@/app/lib/hooks/cuti/useCuti";

export const useCutiData = () => {
    const today = new Date();
    const defaultMonth = format(today, "yyyy-MM");

    const { data: usersData, isLoading: isLoadingUsers, error: errorUsers } = useUser().fetchAllUser({ limit: 1000 });
    const { data: kontrakData, isLoading: isLoadingKontrak, error: errorKontrak } = useKontrak().fetchAllKontrak({ limit: 1000 });
    const { data: cutiData, isLoading: isLoadingCuti, error: errorCuti } = useCuti().fetchAllCuti({
        limit: 1000,
        status: CutiStatus.DITERIMA || CutiStatus.MENUNGGU,
        minStartDate: startOfMonth(new Date(defaultMonth + "-01")).toISOString(),
        maxEndDate: endOfMonth(new Date(defaultMonth + "-01")).toISOString(),
    });

    const users = usersData?.data.filter((m: any) => m.majorRole !== MajorRole.OWNER) || [];
    const allKontrak = kontrakData?.data || [];

    const getWorkingDaysInMonth = (monthString: string) => {
        const [year, month] = monthString.split("-").map(Number);
        const start = startOfMonth(new Date(year, month - 1));
        const end = endOfMonth(new Date(year, month - 1));
        
        const allDays = eachDayOfInterval({ start, end });
        return allDays.filter(day => !isWeekend(day));
    };

    const workingDaysInMonth = getWorkingDaysInMonth(defaultMonth);

    const getDailyCutiStats = (day: Date) => {
        if (!cutiData?.data) return { pending: 0, accepted: 0, total: 0 };

        const dayStart = new Date(day.setHours(0, 0, 0, 0));
        const dayEnd = new Date(day.setHours(23, 59, 59, 999));

        const dailyCuti = cutiData.data.filter((cuti: any) => {
            const start = new Date(cuti.startDate);
            const end = new Date(cuti.endDate);
            return dayStart <= end && dayEnd >= start;
        });

        const pending = dailyCuti.filter((c: any) => c.status === CutiStatus.MENUNGGU).length;
        const accepted = dailyCuti.filter((c: any) => c.status === CutiStatus.DITERIMA).length;

        return {
            pending,
            accepted,
            total: dailyCuti.length
        };
    };

    const dailyCutiStats = workingDaysInMonth.map(day => getDailyCutiStats(day));

    return {
        workingDaysInMonth,
        dailyCutiStats,
        isLoadingCuti,
        cutiData,
        users, 
        allKontrak, 
        defaultMonth 
    }
}


export const CutiChart = ({ dailyCutiStats, workingDays, isLoading }: any) => {
    const labels = workingDays.map((day: Date) => format(day, "dd MMM"));

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Diterima',
                data: dailyCutiStats.map((s: any) => s.accepted),
                backgroundColor: `${COLORS.successOpa}`,
                borderColor: `${COLORS.success}`,
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: 'Menunggu',
                data: dailyCutiStats.map((s: any) => s.pending),
                backgroundColor: `${COLORS.tertiaryOpa}`,
                borderColor: `${COLORS.tertiary}`,
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
                        return `Total Cuti: ${total} Orang`;
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