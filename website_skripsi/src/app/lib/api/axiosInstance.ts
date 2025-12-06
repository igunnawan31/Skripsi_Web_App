import axios, { Axios, AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { useAuthStore } from "../stores/authStores";
import Cookies from "js-cookie";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance = axios.create({
    baseURL: "/",
    withCredentials: true,
});

let isRefreshing = false;
let queue: Array<(ok: boolean) => void> = [];

function subscribeTokenRefresh(cb: (ok: boolean) => void) {
    queue.push(cb);
};

function notifyAllSubscribers(ok: boolean) {
    queue.forEach((cb) => cb(ok));
    queue = [];
}

axiosInstance.interceptors.response.use(
    (res) => res,
    async (errror: AxiosError) => {
        const status = errror.response?.status;
        const originalRequest = errror.config as AxiosRequestConfig & { _retry?: boolean };

        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh((ok: boolean) => {
                        if (ok) {
                            resolve(axiosInstance(originalRequest));
                        } else {
                            reject(errror);
                        }
                    });
                });
            }

            isRefreshing = true;

            const ok = await fetch("/api/auth/refresh", {
                method: "POST",
                credentials: "include",
            })
            .then((res) => res.ok)
            .catch(() => false);

            isRefreshing = false;
            notifyAllSubscribers(ok);

            if (ok) return axiosInstance(originalRequest);
            if (typeof window !== "undefined") window.location.href = "/";
        }

        return Promise.reject(errror);
    }
);


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
