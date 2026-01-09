import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const useReimburse = () => {
    const fetchAllReimburse = (filters?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        approvalStatus?: string;
        minSubmittedDate?: string;
        maxSubmittedDate?: string;
        searchTerm?: string;
    }) => {
        return useQuery({
            queryKey: ["reimburses", filters],
            queryFn: async () => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const queryParams = new URLSearchParams();
                if (filters?.page) queryParams.append("page", filters.page.toString());
                if (filters?.limit) queryParams.append("limit", filters.limit.toString());
                if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
                if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
                if (filters?.approvalStatus) queryParams.append("approvalStatus", filters.approvalStatus);
                if (filters?.minSubmittedDate) queryParams.append("minSubmittedDate", filters.minSubmittedDate);
                if (filters?.maxSubmittedDate) queryParams.append("maxSubmittedDate", filters.maxSubmittedDate);
                if (filters?.searchTerm) queryParams.append("searchTerm", filters.searchTerm);

                const response = await fetch(`${API}/reimburses?${queryParams.toString()}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "Failed to fetch reimburse");
                }

                return response.json();
            },
            staleTime: 5 * 60 * 1000,
        });
    }

    const fetchReimburseById = (id: string) => {
        return useQuery ({
            queryKey: ["reimburse", id],
            queryFn: async () => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/reimburses/${id}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "Failed to fetch reimburse by ID");
                }

                return response.json();
            },
            enabled: !!id,
            staleTime: 5 * 60 * 1000,
        });
    }

    const approveReimburse = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            { id: string; catatan?: string }
        >({
            mutationFn: async ({ id, catatan }) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/reimburses/${id}/approve`, {
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
                    throw new Error(errorData.message || "Failed to approve reimburse");
                }

                return response.json();
            },

            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["reimburses"] });
            },
        });
    }

    const rejectReimburse = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            { id: string; catatan?: string }
        >({
            mutationFn: async ({ id, catatan}) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/reimburses/${id}/reject`, {
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
                    throw new Error(errorData.message || "Failed to reject reimburse");
                }

                return response.json();
            },

            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["reimburses"] });
            },
        })
    }

    return {
        fetchAllReimburse,
        fetchReimburseById,
        approveReimburse,
        rejectReimburse,
    };
}