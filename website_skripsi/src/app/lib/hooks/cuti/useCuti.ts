import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CustomToast from "@/app/rootComponents/CustomToast";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const useCuti = () => {
    const fetchAllCuti = (filters?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        status?: string;
        minStartDate?: string;
        maxEndDate?: string;
        searchTerm?: string;
    }) => {
        return useQuery({
            queryKey: ["cuti", filters],
            queryFn: async () => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const queryParams = new URLSearchParams();
                if (filters?.page) queryParams.append("page", filters.page.toString());
                if (filters?.limit) queryParams.append("limit", filters.limit.toString());
                if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
                if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
                if (filters?.status) queryParams.append("status", filters.status);
                if (filters?.minStartDate) queryParams.append("minStartDate", filters.minStartDate);
                if (filters?.maxEndDate) queryParams.append("maxEndDate", filters.maxEndDate);
                if (filters?.searchTerm) queryParams.append("searchTerm", filters.searchTerm);

                const response = await fetch(`${API}/cuti?${queryParams.toString()}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "Failed to fetch cuti");
                }

                return response.json();
            },
            staleTime: 5 * 60 * 1000,
        });
    }

    const fetchCutiById = (id: string) => {
        return useQuery ({
            queryKey: ["cuti", id],
            queryFn: async () => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/cuti/${id}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "Failed to fetch cuti by ID");
                }

                return response.json();
            },
            enabled: !!id,
            staleTime: 5 * 60 * 1000,
        });
    }    

    const approveCuti = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            { id: string; catatan?: string }
        >({
            mutationFn: async ({ id, catatan }) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/cuti/approve/${id}`, {
                    method: "PATCH",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                    body: JSON.stringify({ catatan }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "Failed to approve cuti");
                }

                return response.json();
            },

            onSuccess: (data, variables) => {
                queryClient.invalidateQueries({ queryKey: ["cuti", variables.id]});
            },
        });
    }

    const rejectCuti = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            { id: string; catatan?: string }
        >({
            mutationFn: async ({ id, catatan}) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/cuti/reject/${id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                    body: JSON.stringify({ catatan }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "Failed to reject cuti");
                }

                return response.json();
            },

            onSuccess: (data, variables) => {
                queryClient.invalidateQueries({ queryKey: ["cuti", variables.id]});
            }
        })
    }

    return {
        fetchAllCuti,
        fetchCutiById,
        approveCuti,
        rejectCuti,
    };
}