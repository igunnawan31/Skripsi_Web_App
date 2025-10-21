import React from "react";
import { AuthProvider } from "../dashboard/dashboardComponents/authComponents/AuthProvider";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const renderHtml = (
        // <AuthProvider>
        <>
            {children}
        </>
        // </AuthProvider>
    );
    return renderHtml;
}