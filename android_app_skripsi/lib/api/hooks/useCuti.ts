import { getTokens } from "@/lib/utils/secureStorage"
import { CreateCutiRequest } from "@/types/cuti/cutiTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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
            queryKey: ["cutis", filters],
            queryFn: async () => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");

                const queryParams = new URLSearchParams();
                if (filters?.page) queryParams.append("page", filters.page.toString());
                if (filters?.limit) queryParams.append("limit", filters.limit.toString());
                if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
                if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
                if (filters?.status) queryParams.append("status", filters.status);
                if (filters?.minStartDate) queryParams.append("minStartDate", filters.minStartDate);
                if (filters?.maxEndDate) queryParams.append("maxEndDate", filters.maxEndDate);
                if (filters?.searchTerm) queryParams.append("searchTerm", filters.searchTerm);

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/cuti?${queryParams.toString()}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch cuti";
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
            staleTime: 5 * 60 * 1000,
        });
    }

    const fetchCutiByUserId = (userId: string) => {
        return useQuery({
            queryKey: ["cuti-by-user", userId],
            queryFn: async() => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");
                
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/cuti/user/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch cuti by User"
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.response?.message || errorData.message || errorMessage;
                    } catch {
                        errorMessage = response.statusText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }

                const result = await response.json();
                return result;
            },
            enabled: !!userId,
            staleTime: 5 * 60 * 1000,  
        })
    }

    const fetchCutiById = (id: string) => {
        return useQuery({
            queryKey: ["cuti-single", id],
            queryFn: async() => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");
                
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/cuti/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch cuti by ID"
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.response?.message || errorData.message || errorMessage;
                    } catch {
                        errorMessage = response.statusText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }

                const result = await response.json();
                return result;
            },
            enabled: !!id,
            staleTime: 5 * 60 * 1000,
        });
    }

    const createCuti = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            CreateCutiRequest
        >({
            mutationFn: async (cutiData: CreateCutiRequest) => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");

                const fd = new FormData();
                fd.append("userId", cutiData.userId);
                fd.append("startDate", cutiData.startDate);
                fd.append("endDate", cutiData.endDate);
                fd.append("reason", cutiData.reason);
                
                if (cutiData.dokumenCuti) {
                    fd.append("dokumenCuti", cutiData.dokumenCuti);
                }

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/cuti`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                    body: fd,
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch absensi by ID"
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

            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["cutis"] });
            },
        });
    }

    return {
        fetchAllCuti,
        fetchCutiByUserId,
        fetchCutiById,
        createCuti,
    }
}