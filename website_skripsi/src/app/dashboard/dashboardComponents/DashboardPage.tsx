"use client";

import { motion } from "framer-motion";
import { useUserLogin } from "@/app/context/UserContext";
import DataModal from "./DataModal";
import TableModal from "./TableModal";
import { useState } from "react";
import CalendarModal from "./CalendarModal";
import { useAgenda } from "@/app/lib/hooks/agenda/useAgenda";
import { icons } from "@/app/lib/assets/assets";
import Image from "next/image";

export default function DashboardPage() {
    const user = useUserLogin();
    const [actionType, setActionType] = useState<"Overview" | "Calendar">("Overview");
    const { data, isLoading, error} = useAgenda().fetchAllAgendas();
    const agendaData = Array.isArray(data?.data) ? data.data : [];

    const renderHtml = (
        <div className="flex flex-col gap-4 pb-8 w-full">
            <div className="w-ful bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all relative overflow-x-auto">
                <div className="w-full flex gap-4">
                    <span
                        onClick={() => setActionType("Overview")} 
                        className={`flex items-center justify-center hover:bg-yellow-600 hover:text-(--color-surface) hover:font-semibold p-4 cursor-pointer gap-4 rounded-lg ${actionType === "Overview" ? "bg-yellow-500 rounded-lg font-bold" : "bg-(--color-tertiary)/30"}`}
                    >
                        Overview
                    </span>
                    <span
                        onClick={() => setActionType("Calendar")}
                        className={`flex items-center justify-center hover:bg-yellow-600 hover:text-(--color-surface) hover:font-semibold p-4 cursor-pointer gap-4 rounded-lg ${actionType === "Calendar" ? "bg-yellow-500 rounded-lg font-bold" : "bg-(--color-tertiary)/30"}`}
                    >
                        Calendar
                    </span>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                {actionType === "Overview" && (
                    <>
                        <DataModal
                            title="Dashboard Overview"
                            description="Real-time monitoring of your organization attendings "
                        />
                        <TableModal />
                    </>
                )}
                {actionType === "Calendar" && isLoading && (
                    <p className="text-slate-400">Loading calendar...</p>
                )}

                {actionType === "Calendar" && !isLoading && (
                    <CalendarModal events={agendaData} />
                )}
            </div>
        </div>
    );

    return renderHtml;
}
