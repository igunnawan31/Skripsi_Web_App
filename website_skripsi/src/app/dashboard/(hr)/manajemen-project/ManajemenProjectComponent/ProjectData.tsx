"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useProject } from "@/app/lib/hooks/project/useProject";
import { ProjectStatus } from "@/app/lib/types/fixTypes";
import { ResponseProject } from "@/app/lib/types/project/projectTypes";

const ProjectData = () => {
    const { data } = useProject().fetchAllProject();

    const stats = useMemo(() => {
        const projects: ResponseProject[] = data?.data || [];
        
        return [
            {
                id: 1,
                label: "Active",
                status: ProjectStatus.ACTIVE,
                value: projects.filter(p => p.status === ProjectStatus.ACTIVE).length,
                color: "bg-emerald-100 text-emerald-700",
            },
            {
                id: 2,
                label: "On Hold",
                status: ProjectStatus.ON_HOLD,
                value: projects.filter(p => p.status === ProjectStatus.ON_HOLD).length,
                color: "bg-amber-100 text-amber-700",
            },
            {
                id: 3,
                label: "Completed",
                status: ProjectStatus.COMPLETED,
                value: projects.filter(p => p.status === ProjectStatus.COMPLETED).length,
                color: "bg-blue-100 text-blue-700",
            }
        ];
    }, [data]);

    return (
        <div className="relative w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((item) => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all relative"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${item.color}`}>
                                {item.label}
                            </span>
                        </div>
                        <h3 className="text-4xl font-bold text-slate-800">
                            {item.value}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Jumlah {item.label} Projects
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default ProjectData;