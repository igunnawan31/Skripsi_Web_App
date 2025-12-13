"use server";

import React from "react";
import SidebarMenu from "./dashboardComponents/SidebarMenu";
import Navbar from "./dashboardComponents/Navbar";
import { poppins } from "../ui/fonts";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeJwt, decodeJwtExpMs } from "../lib/jwt";
import { UserContext } from "../context/UserContext";
import ClientUserProvider from "../context/ClientUserProvider";

const API = process.env.API_URL || "http://localhost:4000";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) redirect("/");

    const payload = decodeJwt(accessToken);
    const userId = payload?.sub;
    if (!userId) redirect("/");

    const res = await fetch(`${API}/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
    });
    if (!res.ok) redirect("/");

    const user = await res.json();
    
    const renderHtml = (
        <ClientUserProvider user={user}>
            <div className={`${poppins.className} antialiased flex h-screen`}>
                <div className="w-fit h-screen overflow-y-auto">
                    <SidebarMenu user={user} />
                </div>
                <div className="w-full h-screen overflow-y-auto px-10">
                    <Navbar user={user} withDropdown={true} />
                    <div className=" text-(--color-text-primary) w-full">
                        {children}
                    </div>
                </div>
            </div>
        </ClientUserProvider>
    );
    return renderHtml;
}