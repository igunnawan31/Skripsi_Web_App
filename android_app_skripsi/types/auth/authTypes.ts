import { User } from "../user/userTypes";

export type LoginResponse = {
    access_token: string;
    refresh_token: string;
    user: User;
}

export type LoginVars = {
    email: string;
    password: string;
}

export type AuthState = {
    user: any | null;
    access_token: string | null;
    refresh_token: string | null;
    isAuthenticated: boolean;

    loginSuccess: (access_token: string, refresh_token: string, user: any) => void;
    setUserProfile: (profile: any) => void;
    logout: () => void;
    logoutAndClear: () => Promise<void>;
};