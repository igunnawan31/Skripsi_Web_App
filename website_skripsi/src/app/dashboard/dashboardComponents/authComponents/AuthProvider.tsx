"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AuthProps } from "../../props/AuthProps";

const AuthContext = createContext<AuthProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [authReady, setAuthReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
        setUser(JSON.parse(storedUser));
        }
        setAuthReady(true);
    }, []);

    useEffect(() => {
        if (authReady && !user) {
            router.push("/sign-in");
        }
    }, [authReady, user, router]);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                email,
                password,
            });

            const userData = res.data.user;
            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("refresh_token", res.data.refresh_token);
            localStorage.setItem("user", JSON.stringify(userData));

            setUser(userData);
            return userData;
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        setUser(null);
        router.push("/sign-in");
    };

    const getToken = () => localStorage.getItem("access_token");

    return (
        <AuthContext.Provider value={{ user, authReady, loading, error, login, logout, getToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}
