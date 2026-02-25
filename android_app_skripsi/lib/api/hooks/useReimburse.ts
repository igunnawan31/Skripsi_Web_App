import { getTokens } from "@/lib/utils/secureStorage"
import { CreateCutiRequest } from "@/types/cuti/cutiTypes";
import { CreateReimburseRequest } from "@/types/reimburse/reimburseTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");

                const queryParams = new URLSearchParams();
                if (filters?.page) queryParams.append("page", filters.page.toString());
                if (filters?.limit) queryParams.append("limit", filters.limit.toString());
                if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
                if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
                if (filters?.approvalStatus) queryParams.append("approvalStatus", filters.approvalStatus);
                if (filters?.minSubmittedDate) queryParams.append("minSubmittedDate", filters.minSubmittedDate);
                if (filters?.maxSubmittedDate) queryParams.append("maxSubmittedDate", filters.maxSubmittedDate);
                if (filters?.searchTerm) queryParams.append("searchTerm", filters.searchTerm);

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/reimburses?${queryParams.toString()}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch reimburse";
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

    const fetchReimburseById = (id: string) => {
        return useQuery({
            queryKey: ["reimburse-single", id],
            queryFn: async() => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");
                
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/reimburses/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch reimburse by ID"
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

    const createReimburse = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            CreateReimburseRequest
        >({
            mutationFn: async (reimburseData: CreateReimburseRequest) => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");

                const fd = new FormData();
                fd.append("title", reimburseData.title);
                fd.append("totalExpenses", String(reimburseData.totalExpenses));
                
                reimburseData.reimburseDocuments.forEach((file, index) => {
                    fd.append(
                        "reimburseDocuments",
                        {
                            uri: file.uri,
                            name: file.name,
                            type: file.type,
                        } as any
                    );
                });

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/reimburses`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                    body: fd,
                });

                if (!response.ok) {
                    let errorMessage = "Failed to create reimburse by ID"
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
                queryClient.invalidateQueries({ queryKey: ["reimburses"] });
            },
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
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/reimburses/${id}/approve`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                    body: JSON.stringify({ catatan }),
                });

                if (!response.ok) {
                    let errorMessage = "Failed to approve reimburse"
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
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/reimburses/${id}/reject`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                    body: JSON.stringify({ catatan }),
                });

                if (!response.ok) {
                    let errorMessage = "Failed to reject reimburse"
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

            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["reimburses"] });
            },
        })
    }

    return {
        fetchAllReimburse,
        fetchReimburseById,
        createReimburse,
        approveReimburse,
        rejectReimburse
    }
}