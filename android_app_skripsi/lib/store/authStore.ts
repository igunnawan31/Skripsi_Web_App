import { create } from "zustand"
import { removeTokens } from "../utils/secureStorage"
import { AuthState } from "@/types/auth/authTypes";

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    access_token: null,
    refresh_token: null,
    isAuthenticated: false,

    loginSuccess: (access_token: string, refresh_token: string, user: any) =>
        set({access_token, refresh_token, user, isAuthenticated: true}),
    
    setUserProfile: (profile: any) => set((state) => ({ user: { ...state.user, ...profile } })),
    
    logout: () => set({access_token: null, refresh_token: null, user: null, isAuthenticated: false}),
    
    logoutAndClear: async() => {
        await removeTokens();
        set({access_token: null, refresh_token: null, user: null, isAuthenticated: false});
    },
}));