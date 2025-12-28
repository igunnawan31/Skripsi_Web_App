import { useAuthStore } from "@/lib/store/authStore";
import { getTokens, removeTokens, saveTokens } from "@/lib/utils/secureStorage";
import axios from "axios";

export const apiClient = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
});

apiClient.interceptors.request.use(async (config) => {
    const stored = await getTokens();
    if (stored?.access_token) {
        config.headers.Authorization = `Bearer ${stored.access_token}`;
    }
    return config
});

apiClient.interceptors.response.use(
    (res) => res,
    async (err) => {
        const { logout } = useAuthStore.getState();

        if (err.response.status === 401) {
            const stored = await getTokens();
            const refreshToken = stored?.refresh_token;
            const userId = stored?.user_id
            
            if (!refreshToken || !userId) {
                await removeTokens();
                logout();
                return Promise.reject(err);
            }

            try {
                const refreshRes = await axios.post("/auth/refresh", { refresh_token: refreshToken});
                const newAccess = refreshRes.data.access_token;
                const newRefresh = refreshRes.data.refresh_token;

                await saveTokens(newAccess, newRefresh, userId);
                
                err.config.headers.Authorization = `Bearer ${newAccess}`;
                return apiClient.request(err.config);
            } catch {
                await removeTokens();
                logout();
            }
        }

        return Promise.reject(err);
    }
)