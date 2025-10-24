import React from "react";
import { AuthProvider } from "../dashboard/dashboardComponents/authComponents/AuthProvider";
import SidebarMenu from "./dashboardComponents/SidebarMenu";
import Navbar from "./dashboardComponents/Navbar";
import { poppins } from "../ui/fonts";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const renderHtml = (
        // <AuthProvider>
        <div className={`${poppins.className} antialiased flex h-screen`}>
            <div className="w-[20%] h-full">
                <SidebarMenu />
            </div>
            <div className="w-[80%] h-full">
                <Navbar />
                <div className="px-8 text-blue-900 w-full">
                    {children}
                </div>
            </div>
        </div>
        // </AuthProvider>
    );
    return renderHtml;
}