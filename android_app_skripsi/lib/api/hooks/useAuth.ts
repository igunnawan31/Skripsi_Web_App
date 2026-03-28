import { useAuthStore } from "@/lib/store/authStore";
import { removeTokens, saveTokens } from "@/lib/utils/secureStorage";
import { LoginResponse, LoginVars } from "@/types/auth/authTypes";
import { MajorRole, MinorRole } from "@/types/enumTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAuth = () => {
    const query = useQueryClient();
    const { loginSuccess, logout } = useAuthStore.getState();

    const loginMutation = useMutation<LoginResponse, Error, LoginVars>({
        mutationFn: async ({email, password}) => {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                let errorMessage = "Login failed";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.response?.message || errorData.message || errorMessage;
                } catch {
                    errorMessage = response.statusText || "Terjadi kesalahan selama login berlangsung";
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            return result;
        },
        onSuccess: async (data) => {
            await saveTokens(data.access_token, data.refresh_token, data.user.id);
            loginSuccess(data.access_token, data.refresh_token, data.user);
            query.invalidateQueries();
        },
    });

    const logoutAction = async () => {
        await removeTokens();
        useAuthStore.getState().logout();
        query.clear();
    };

    const verifyEmail = () => {
        return useMutation<
            any,
            Error,
            { email: string }
        >({
            mutationFn: async ({ email }) => {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/forgot-password`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json" 
                    },
                    credentials: "include",
                    body: JSON.stringify({ email }),
                });

                if (!response.ok) {
                    let errorMessage = "Login failed";
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.response?.message || errorData.message || errorMessage;
                    } catch {
                        errorMessage = response.statusText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }

                return response.json();
            },
        })
    }

    const verifyOTP = () => {
        return useMutation<
            any,
            Error,
            { email: string; otp: string }
        >({
            mutationFn: async ({ email, otp }) => {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/verify-otp`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json" 
                    },
                    credentials: "include",
                    body: JSON.stringify({ email, otp }),
                });

                if (!response.ok) {
                    let errorMessage = "Login failed";
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.response?.message || errorData.message || errorMessage;
                    } catch {
                        errorMessage = response.statusText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }

                return response.json();
            },
        })
    }

    const resetPassword = () => {
        return useMutation<
            any,
            Error,
            { email: string; otp: string, newPassword: string }
        >({
            mutationFn: async ({ email, otp, newPassword }) => {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/reset-password`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json" 
                    },
                    credentials: "include",
                    body: JSON.stringify({ email, otp, newPassword }),
                });

                if (!response.ok) {
                    let errorMessage = "Login failed";
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.response?.message || errorData.message || errorMessage;
                    } catch {
                        errorMessage = response.statusText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }

                return response.json();
            },
        })
    }

    return {
        loginMutation,
        logoutAction,
        verifyEmail,
        verifyOTP,
        resetPassword
    }
}