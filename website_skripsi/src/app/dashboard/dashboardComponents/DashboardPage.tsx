"use client";
import { useUserLogin } from "@/app/context/UserContext";
import DataModal from "./DataModal";
import TableModal from "./TableModal";
import { useState } from "react";
import CalendarModal from "./CalendarModal";
import { useAgenda } from "@/app/lib/hooks/agenda/useAgenda";

export default function DashboardPage() {
    const user = useUserLogin();
    const [actionType, setActionType] = useState<"overview" | "calendar">("overview");
    const { data, isLoading, error} = useAgenda().fetchAllAgendas();
    const agendaData = Array.isArray(data?.data) ? data.data : [];

    const renderHtml = (
        <div className="min-h-screen">
            <section className="flex flex-col gap-4 pb-8">
                <div className="w-full border-b-2 border-b-(--color-tertiary) flex">
                    <span
                        onClick={() => setActionType("overview")}
                        className={`hover:bg-(--color-tertiary)/60 p-4 cursor-pointer rounded-t-lg ${actionType === "overview" ? "bg-(--color-tertiary) rounded-t-lg" : "bg-transparent"}`}
                    >
                        Overview
                    </span>
                    <span
                        onClick={() => setActionType("calendar")}
                        className={`hover:bg-(--color-tertiary)/60 p-4 cursor-pointer rounded-t-lg ${actionType === "calendar" ? "bg-(--color-tertiary) rounded-t-lg" : "bg-transparent"}`}
                    >
                        Calendar
                    </span>
                </div>
                {actionType === "overview" && (
                    <>
                        <DataModal />
                        <TableModal />
                    </>
                )}
                {actionType === "calendar" && isLoading && (
                    <p className="text-slate-400">Loading calendar...</p>
                )}

                {actionType === "calendar" && !isLoading && (
                    <CalendarModal events={agendaData} />
                )}
            </section>
        </div>
    );

    return renderHtml;
}
