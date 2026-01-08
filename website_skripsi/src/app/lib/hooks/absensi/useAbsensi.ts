import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { fetchAbsensi } from "../dummyHooks/fetchAbsensi";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const useAbsensi = () => {
    const fetchAllAbsensi = (filters?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        status?: string;
        date?: string;
        majorRole?: string;
        minorRole?: string;
        searchTerm?: string;
    }) => {
        return useQuery({
            queryKey: ["absens", filters],
            queryFn: async () => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const queryParams = new URLSearchParams();
                if (filters?.page) queryParams.append("page", filters.page.toString());
                if (filters?.limit) queryParams.append("limit", filters.limit.toString());
                if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
                if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
                if (filters?.status) queryParams.append("status", filters.status);
                if (filters?.majorRole) queryParams.append("majorRole", filters.majorRole);
                if (filters?.minorRole) queryParams.append("minorRole", filters.minorRole);
                if (filters?.date) queryParams.append("date", filters.date);
                if (filters?.searchTerm) queryParams.append("searchTerm", filters.searchTerm);

                const response = await fetch(`${API}/absensi?${queryParams.toString()}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "Failed to fetch absensi");
                }

                return response.json();
            },
            staleTime: 5 * 60 * 1000,
        });
    }

    const fetchAbsensiById = (id: string, date: string) => {
        return useQuery ({
            queryKey: ["absen-single", id, date],
            queryFn: async () => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/absensi/single/${id}?date=${date}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "Failed to fetch absensi by ID");
                }

                return response.json();
            },
            enabled: !!id && !!date,
            staleTime: 5 * 60 * 1000,
        });
    }

    const fetchAbsensiByUserId = (id: string, year: number, month:number) => {
        return useQuery({
            queryKey: ["absen", id, year, month],
            queryFn: async () => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/absensi/${id}?year=${year}&month=${month}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
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

    return {
        fetchAllAbsensi,
        fetchAbsensiById,
        fetchAbsensiByUserId,
    };
}