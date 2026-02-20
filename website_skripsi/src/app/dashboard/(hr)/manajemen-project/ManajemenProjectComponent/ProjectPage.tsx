"use client";

import { motion } from "framer-motion";
import ProjectShows from "./ProjectShows";
import ProjectData from "./ProjectData";

const ProjectPage = () => {
    const renderHtml = (
        <div className="flex flex-col gap-4 w-full">
            <div className="w-full">
                <ProjectData />
            </div>
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all relative"
            >
                <div className="flex flex-col gap-4">
                    <ProjectShows />
                </div>
            </motion.div>
        </div>
    )

    return renderHtml;
}

export default ProjectPage;