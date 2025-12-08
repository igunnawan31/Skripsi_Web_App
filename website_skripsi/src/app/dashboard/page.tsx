"use client";

import { useUserLogin } from "../context/UserContext";
import { redirect, useSearchParams } from "next/navigation";
import DashboardPage from "./dashboardComponents/DashboardPage";
import { useEffect } from "react";
import toast from "react-hot-toast";
import CustomToast from "../rootComponents/CustomToast";
import { MajorRole, MinorRole } from "../lib/types/types";

const Dashboard = () => {
    const searchParams = useSearchParams();
    const alreadyLoggedIn = searchParams.get("alreadyLoggedIn");
    const user = useUserLogin();

    useEffect(() => {
        if (alreadyLoggedIn) {
            toast.custom(
                <CustomToast
                    type="error"
                    message="You are already logged in!"
                />
            )
        }
    }, [alreadyLoggedIn]);

    if (user === undefined) {
        return (
            <div className="flex items-center justify-center min-h-screen text-lg">
                Loading your dashboard...
            </div>
        );
    }

    if (!user) {
        redirect("/");
    }

    switch (user.majorRole) {
        case MajorRole.OWNER:
            return <DashboardPage />;

        case MajorRole.KARYAWAN:
            if (user.minorRole === MinorRole.HR) {
                return <DashboardPage />;
            } else {
                redirect("/");
            }

        default:
            return <p>Role not recognized: {user.majorRole}</p>;
    }
};

export default Dashboard;
