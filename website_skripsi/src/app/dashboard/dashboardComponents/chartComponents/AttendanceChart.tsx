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
import { MajorRole } from "@/app/lib/types/enumTypes";
import { useQueries } from "@tanstack/react-query";
import Cookies from "js-cookie";
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

export const useAbsenseData = () => {
    const today = new Date();
    const defaultMonth = format(today, "yyyy-MM");

    const { data: usersData, isLoading: isLoadingUsers, error: errorUsers } = useUser().fetchAllUser({ limit: 1000 });
    const { data: kontrakData, isLoading: isLoadingKontrak, error: errorKontrak } = useKontrak().fetchAllKontrak({ limit: 1000 });

    const users = usersData?.data.filter((m: any) => m.majorRole !== MajorRole.OWNER) || [];
    const allKontrak = kontrakData?.data || [];

    const getWorkingDaysInMonth = (monthString: string) => {
        const [year, month] = monthString.split("-").map(Number);
        const start = startOfMonth(new Date(year, month - 1));
        const end = endOfMonth(new Date(year, month - 1));
        
        const allDays = eachDayOfInterval({ start, end });
        return allDays.filter(day => !isWeekend(day));
    };

    const getUserAttendanceSummary = (userId: string) => {
        let attendanceCount = 0;

        workingDaysInMonth.forEach((day, index) => {
            const query = attendanceQueries[index];
            const attendanceForDay = query.data?.data || [];            
            const userAttendance = attendanceForDay.find((a: any) => a.user?.id === userId || a.userId === userId);
            
            if (userAttendance && userAttendance.checkIn) {
                attendanceCount++;
            }
        });

        return attendanceCount;
    };

    const workingDaysInMonth = getWorkingDaysInMonth(defaultMonth);
    const attendanceQueries = useQueries({
        queries: workingDaysInMonth.map(day => {
            const dateStr = format(day, "yyyy-MM-dd");
            return {
                queryKey: ["absens", { date: new Date(`${dateStr}T00:00:00`).toISOString(), limit: 1000 }],
                queryFn: async () => {
                    const token = Cookies.get("accessToken");
                    if (!token) throw new Error("No access token found");

                    const queryParams = new URLSearchParams();
                    queryParams.append("date", new Date(`${dateStr}T00:00:00`).toISOString());
                    queryParams.append("limit", "1000");

                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/absensi?${queryParams.toString()}`, {
                        method: "GET",
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        credentials: "include",
                    });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch absensi";
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.response?.message || errorData.message || errorMessage;
                    } catch {
                        errorMessage = response.statusText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }

                    return response.json();
                },
                staleTime: 5 * 60 * 1000,
            };
        }),
    });

    const checkStatus = (checkIn?: string) => {
        if (!checkIn) return "none";
        const zoned = toZonedTime(checkIn, "Asia/Jakarta");
        const limit = new Date(zoned);
        limit.setHours(8, 30, 0, 0);
        return zoned > limit ? "Terlambat" : "Tepat Waktu";
    };
    const isLoadingAttendance = attendanceQueries.some(q => q.isLoading);

    const allRecords = attendanceQueries.flatMap(q => q.data?.data || []);

    const onTimeCount = allRecords.filter((r: any) => checkStatus(r.checkIn) === "Tepat Waktu").length;
    const lateCount = allRecords.filter((r: any) => checkStatus(r.checkIn) === "Terlambat").length;
    const totalAbsence = allRecords.filter((r: any) => r.checkIn).length;

    return { 
        attendanceQueries, 
        workingDaysInMonth, 
        isLoadingAttendance,
        onTimeCount, 
        lateCount, 
        totalAbsence,
        checkStatus,
        getUserAttendanceSummary, 
        users, 
        allKontrak, 
        defaultMonth 
    }
}

export const AttendanceChart = ({ attendanceQueries, workingDays, isLoading }: any) => {
    const getStatus = (checkIn?: string) => {
        if (!checkIn) return null;
        const zoned = toZonedTime(checkIn, "Asia/Jakarta");
        const limit = new Date(zoned);
        limit.setHours(8, 30, 0, 0);
        return zoned > limit ? "Terlambat" : "Tepat Waktu";
    };

    const onTimeData = workingDays.map(( _: any, index: number ) => {
        const dayData = attendanceQueries[index]?.data?.data || [];
        return dayData.filter((r: any) => getStatus(r.checkIn) === "Tepat Waktu").length;
    });

    const lateData = workingDays.map(( _: any, index: number ) => {
        const dayData = attendanceQueries[index]?.data?.data || [];
        return dayData.filter((r: any) => getStatus(r.checkIn) === "Terlambat").length;
    });

    const labels = workingDays.map((day: Date) => format(day, "dd MMM"));

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Late',
                data: lateData,
                backgroundColor: `${COLORS.primaryOpa}`,
                borderColor: `${COLORS.primary}`,
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: 'On Time',
                data: onTimeData,
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