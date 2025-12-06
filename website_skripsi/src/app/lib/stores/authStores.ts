"use client";

import { create } from "zustand";
import { User } from "../types/types";

type AuthState = {
    accessToken: string | null;
    expiresAt: number | null;
    user: User | null;
    setAuth: (accesToken: string, user: User, expiresAt: number) => void;
    setAccessToken: (token: string | null) => void;
    clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    expiresAt: null,
    user: null,
    setAuth: (accessToken, user, expiresAt) => set({ accessToken, user, expiresAt }),
    setAccessToken: (token) => set({ accessToken: token }),
    clearAuth: () => set({ accessToken: null, user: null }),
}));