"use client";
import DataModal from "./DataModal";
import TableModal from "./TableModal";

export default function DashboardPage() {
    const renderHtml = (
        <div className="min-h-screen">
            <section className="flex flex-col gap-4">
                <DataModal />
                <TableModal />
            </section>
        </div>
    );

    return renderHtml;
}
