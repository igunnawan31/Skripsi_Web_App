"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAuthStore } from "../../stores/authStores";

export const useRestoreAuth = () => {
    const setAccessToken = useAuthStore((state) => state.setAccessToken);

    useEffect(() => {
        const token = Cookies.get("accessToken");
        if (token) {
            setAccessToken(token);
        }
    }, [setAccessToken]);
};
