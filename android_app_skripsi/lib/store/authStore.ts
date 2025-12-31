import { create } from "zustand"
import { removeTokens } from "../utils/secureStorage"
import { AuthState } from "@/types/auth/authTypes";
import { UserResponse } from "@/types/user/userTypes";

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    access_token: null,
    refresh_token: null,
    isAuthenticated: false,

    loginSuccess: (access_token: string, refresh_token: string, user: any) =>
        set({access_token, refresh_token, user, isAuthenticated: true}),
    
    setUserProfile: (profile: UserResponse) => set((state) => ({ user: { ...state.user, ...profile } })),
    
    logout: () => set({access_token: null, refresh_token: null, user: null, isAuthenticated: false}),
    
    logoutAndClear: async() => {
        await removeTokens();
        set({access_token: null, refresh_token: null, user: null, isAuthenticated: false});
    },
}));