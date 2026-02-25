import { getTokens } from "@/lib/utils/secureStorage";
import { AnswerCreateForm } from "@/types/kpi/kpiTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useJawaban = () => {
    const fetchAllJawaban = (filters?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        maxEndDate?: string;
        searchTerm?: string;
    }) => {
        return useQuery({
            queryKey: ["answers", filters],
            queryFn: async () => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");

                const queryParams = new URLSearchParams();
                if (filters?.page) queryParams.append("page", filters.page.toString());
                if (filters?.limit) queryParams.append("limit", filters.limit.toString());
                if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
                if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
                if (filters?.maxEndDate) queryParams.append("maxEndDate", filters.maxEndDate);
                if (filters?.searchTerm) queryParams.append("searchTerm", filters.searchTerm);

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/answers?${queryParams.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch answers kpi"
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
        })
    }

    const createAnswer = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            AnswerCreateForm[]
        >({
            mutationFn: async (answerData: AnswerCreateForm[]) => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/answers`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                    body: JSON.stringify(answerData),
                });

                if (!response.ok) {
                    let errorMessage = "Failed to create answer";
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                    } catch {
                        errorMessage = response.statusText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }

                return response.json();
            },

            onSuccess: (data, variables) => {
                const indikatorId = variables[0]?.indikatorId;
                
                queryClient.invalidateQueries({ 
                queryKey: ["indicators"],
                exact: false 
            });
            
            queryClient.invalidateQueries({ 
                queryKey: ["answers"],
                exact: false 
            });
            
            if (indikatorId) {
                queryClient.invalidateQueries({ 
                    queryKey: ["indicator", indikatorId],
                    exact: false 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ["indicators-question", indikatorId],
                    exact: false 
                });
            }
            },
        });
    }

    return {
        fetchAllJawaban,
        createAnswer,
    }
}