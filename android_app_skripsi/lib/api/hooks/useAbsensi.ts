import { getTokens } from "@/lib/utils/secureStorage";
import { useQuery } from "@tanstack/react-query";

export const useAbsensi = () => {
    const fetchAbsensiByUserId = (id: string, year: number, month: number) => {
        return useQuery({
            queryKey: ["absen", id, year, month],
            queryFn: async () => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/absensi/${id}?year=${year}&month=${month}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch absensi by ID";
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.response?.message || errorData.message || errorMessage;
                    } catch {
                        errorMessage = response.statusText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }

                const result = await response.json();
                return result.data;
            },
            enabled: !!id && year >= 0 && month >= 0,
            staleTime: 5 * 60 * 1000,
        });
    }

    const fetchAbsensiById = (id: string, date: string) => {
        return useQuery({
            queryKey: ["absen-single", id, date],
            queryFn: async () => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/absensi/single/${id}?date=${date}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch absensi by ID";
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.response?.message || errorData.message || errorMessage;
                    } catch {
                        errorMessage = response.statusText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }

                const result = await response.json();
                return result.data;                
            },
            enabled: !!id && !!date,
            staleTime: 5 * 60 * 1000,
        })
    }

    return {
        fetchAbsensiByUserId,
        fetchAbsensiById
    }
}