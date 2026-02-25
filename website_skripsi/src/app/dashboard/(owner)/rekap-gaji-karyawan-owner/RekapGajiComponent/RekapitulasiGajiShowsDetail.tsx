"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import { icons, logo } from "@/app/lib/assets/assets";
import Link from "next/link";
import { useUser } from "@/app/lib/hooks/user/useUser";
import { motion } from "framer-motion";
import { SalaryResponse, SalaryStatus } from "@/app/lib/types/gaji/gajiTypes";
import { useGaji } from "@/app/lib/hooks/gaji/useGaji";
import RekapCutiShowSkeletonDetail from "./RekapGajiShowsSkeletonDetail";
import { useProject } from "@/app/lib/hooks/project/useProject";
import RekapGajiShowSkeletonDetail from "./RekapGajiShowsSkeletonDetail";

export default function RekapitulasiGajiShowsDetail({ id }: { id: string }) {
    const router = useRouter();
    const today = new Date();
    const searchParams = useSearchParams();
    const kontrakId = searchParams.get("kontrak") || "";
    const projectId = searchParams.get("project") || "";

    const { data: userData, isLoading: isLoadingUser, error: isErrorUser } = useUser().fetchUserById(id);
    const { data: projectData, isLoading: isLoadingProject, error: isErrorProject } = useProject().fetchProjectById(projectId);
    const { data: gajiData, isLoading: isLoadingGaji, error: isErrorGaji } = useGaji().fetchSalaryByUserId({
        id,
        limit: 1000,
    });

    const groupedSalaries = useMemo(() => {
        let salaries: SalaryResponse[] = gajiData?.data || [];
        
        if (kontrakId) {
            salaries = salaries.filter((s) => s.kontrakId === kontrakId);
        }

        const groups: Record<string, { projectName: string; items: SalaryResponse[] }> = {};

        salaries.forEach((s) => {
            const cId = s.kontrakId; 
            
            if (!groups[cId]) {
                groups[cId] = {
                    projectName: s.kontrak?.project?.name || projectData?.name || "Project Detail",
                    items: [],
                };
            }
            groups[cId].items.push(s);
        });

        Object.keys(groups).forEach(key => {
            groups[key].items.sort((a, b) => a.periode.localeCompare(b.periode));
        });

        return groups;
    }, [gajiData, projectData, kontrakId]);

    const stats = useMemo(() => {
        const salaries: SalaryResponse[] = Object.values(groupedSalaries).flatMap(group => group.items);

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
    }, [gajiData, groupedSalaries]);

    const formatIDR = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusColor = (sl: SalaryResponse) => {
        const today = new Date();
        const due = new Date(sl.dueDate);

        if (sl.status === SalaryStatus.PENDING && due > today) 
            return "bg-yellow-100 text-yellow-800";

        if (sl.status === SalaryStatus.PAID) 
            return "bg-green-100 text-green-800";

        if (sl.status === SalaryStatus.OVERDUE) 
            return "bg-red-100 text-red-800";

        if (sl.status === SalaryStatus.PENDING && due < today)
            return "bg-red-100 text-red-800";

        return "bg-gray-100 text-gray-700";
    };

    const getStatusReal = (sl: SalaryResponse) => {
        const today = new Date();
        const due = new Date(sl.dueDate);

        if (sl.status === SalaryStatus.PENDING && due < today) {
            return SalaryStatus.OVERDUE
        }
        if (sl.status === SalaryStatus.PENDING && due > today) {
            return SalaryStatus.PENDING
        }
        if (sl.status === SalaryStatus.PAID) {
            return SalaryStatus.PAID
        }
    }

    if (isLoadingUser || isLoadingGaji || isLoadingProject) {
        return <RekapGajiShowSkeletonDetail />;
    }

    if (isErrorUser  || isErrorProject || isErrorGaji) {
        const errorFetchedData = (
            <div className="flex flex-col gap-6 w-full pb-8">
                <button
                    onClick={() => router.back()}
                    className="w-fit px-3 py-2 bg-(--color-primary) hover:bg-red-800 flex flex-row gap-3 rounded-lg cursor-pointer transition"
                >
                    <Image 
                        src={icons.arrowLeftActive}
                        alt="Back Arrow"
                        width={20}
                        height={20}
                    />
                    <p className="text-(--color-surface)">
                        Kembali ke halaman sebelumnya
                    </p>
                </button>
                <div className="w-full bg-(--color-surface) rounded-2xl shadow-md px-6 py-12 border border-(--color-border) flex flex-col gap-6">
                    <div className="flex flex-col items-center justify-between gap-4">
                        <Image
                            src={logo.error}
                            width={240}
                            height={240}
                            alt="Not Found Data"
                        />
                        <div className="flex flex-col items-center">
                            <h1 className="text-2xl font-bold text-(--color-primary)">
                                {isErrorUser?.message ? isErrorUser.message : isErrorGaji?.message ? isErrorGaji.message : isErrorProject?.message ? isErrorProject.message : "Terdapat kendala pada sistem"}
                            </h1>
                            <span className="text-sm text-(--color-primary)">Mohon untuk melakukan refresh atau kembali ketika sistem sudah selesai diperbaiki</span>
                        </div>
                    </div>
                </div>
            </div>
        );

        return errorFetchedData;
    };

    return (
        <div className="flex flex-col gap-6 w-full pb-8">
            <button
                onClick={() => router.back()}
                className="w-fit px-3 py-2 bg-(--color-primary) hover:bg-red-800 flex flex-row gap-3 rounded-lg cursor-pointer transition"
            >
                <Image 
                    src={icons.arrowLeftActive}
                    alt="Back Arrow"
                    width={20}
                    height={20}
                />
                <p className="text-(--color-surface)">
                    Kembali ke halaman sebelumnya
                </p>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-(--color-text-primary)">
                        Rekapitulasi Gaji - {userData?.name}
                    </h1>
                    <p className="text-sm text-(--color-muted) mt-1">
                        Menampilkan data gaji dari seluruh kontrak aktif dan selesai.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((item) => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all relative"
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
                    </motion.div>
                ))}
            </div>

            {Object.entries(groupedSalaries).map(([cId, group]) => (
                <div key={cId} className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 mt-4">
                        <h2 className="text-lg font-bold text-slate-800">
                            Project: {group.projectName}
                        </h2>
                    </div>

                <div className="w-full bg-(--color-surface) rounded-2xl shadow-md border border-(--color-border) overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                                <thead className="bg-gray-50 border-b border-(--color-border)">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-normal text-gray-600 camelCase">Periode</th>
                                        <th className="px-6 py-4 text-left text-sm font-normal text-gray-600 camelCase">Jatuh Tempo</th>
                                        <th className="px-6 py-4 text-left text-sm font-normal text-gray-600 camelCase">Nominal</th>
                                        <th className="px-6 py-4 text-center text-sm font-normal text-gray-600 camelCase">Status</th>
                                        <th className="px-6 py-4 text-center text-sm font-normal text-gray-600 camelCase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-(--color-border)">
                                    {group.items.map((salary) => (
                                        <tr key={salary.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-slate-700">
                                                {format(new Date(salary.periode + "-01"), "MMMM yyyy")}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {format(new Date(salary.dueDate), "dd MMM yyyy")}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-900">
                                                {formatIDR(salary.amount)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 text-sm font-bold rounded-full border ${getStatusColor(
                                                    salary
                                                )}`}>
                                                    {getStatusReal(salary)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Link
                                                    href={`/dashboard/gaji-karyawan/${salary.id}`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition cursor-pointer"
                                                >
                                                    <Image
                                                        src={icons.viewLogo}
                                                        alt="View"
                                                        width={16}
                                                        height={16}
                                                    />
                                                    See More
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}