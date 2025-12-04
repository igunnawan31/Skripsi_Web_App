"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStores";

export const useTokenCheck = () => {
    const router = useRouter();
    const { expiresAt, clearAuth } = useAuthStore();

    useEffect(() => {
        if (expiresAt && Date.now() >= expiresAt) {
            clearAuth();
            router.push("/login");
        }
    }, [expiresAt, clearAuth, router]);
};