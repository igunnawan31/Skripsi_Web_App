import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { useAuthStore } from "../stores/authStores";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
    baseURL: NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.request.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            const { clearAuth } = useAuthStore.getState();
            clearAuth();
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;


// Ide : Kalo nanti mau ada refresh token

// import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
// import { useAuthStore } from "../stores/authStores";

// const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

// let isRefreshing = false; 
// let refreshPromise: Promise<string | null> | null = null;

// const createAxios = (): AxiosInstance => {
//     const instance = axios.create({
//         baseURL: NEXT_PUBLIC_API_URL,
//         withCredentials: true,
//     });

//     instance.interceptors.request.use((config) => {
//         const token = useAuthStore.getState().accessToken;
//         if (token && config.headers) config.headers["Authorization"] = `Bearer ${token}`;
//         return config;
//     });

//     instance.interceptors.response.use(
//         (res) => res,
//         async (error: AxiosError & { config?: AxiosRequestConfig }) => {
//             const originalRequest = error?.config;
//             if (!originalRequest) return Promise.reject(error);
//             if (error.response?.status !== 401 ) return Promise.reject(error);
            
//             if ((originalRequest as any)._retry) {
//                 useAuthStore.getState().clearAuth();
//                 return Promise.reject(error);
//             }

//             if (isRefreshing && refreshPromise) {
//                 const newToken = await refreshPromise;
//                 if (!newToken) return Promise.reject(error);
//                 (originalRequest as any)._retry = true;
//                 if (originalRequest.headers) originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
//                 return instance(originalRequest);
//             }

//             isRefreshing = true;
//             refreshPromise = (async () => {
//                 try {
//                     const respon = await axios.post(`${NEXT_PUBLIC_API_URL}/auth/refresh`, {}, { withCredentials: true });
//                     const newAccessToken = respon.data?.accessToken;
//                     if (!newAccessToken) throw new Error(error.message || "No access token from refresh");
//                     useAuthStore.getState().setAccessTokern(newAccessToken);
//                     return newAccessToken;
//                 } catch (error) {
//                     useAuthStore.getState().clearAuth();
//                     return null;
//                 } finally {
//                     isRefreshing = false;
//                     refreshPromise = null;
//                 }
//             })();

//             const newAccessToken = await refreshPromise;
//             if (!newAccessToken) return Promise.reject(error);

//             (originalRequest as any)._retry = true;
//             if (originalRequest.headers) originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//             return instance(originalRequest);
//         }
//     );

//     return instance;
    
// }

// export const axiosInstance = createAxios();
// export default axiosInstance;
