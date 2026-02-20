import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { CreateKontrakKerja, UpdateKontrakKerja } from "../../types/kontrak/kontrakTypes";
import { AnswerCreateForm, QuestionCreateForm } from "../../types/kpi/kpiTypes";

const API = process.env.NEXT_PUBLIC_API_URL;

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
                const token =  Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const queryParams = new URLSearchParams();
                if (filters?.page) queryParams.append("page", filters.page.toString());
                if (filters?.limit) queryParams.append("limit", filters.limit.toString());
                if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
                if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
                if (filters?.maxEndDate) queryParams.append("maxEndDate", filters.maxEndDate);
                if (filters?.searchTerm) queryParams.append("searchTerm", filters.searchTerm);

                const response = await fetch(`${API}/answers?${queryParams.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
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
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/answers`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
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

            onSuccess: (variables) => {
                const indikatorId = variables[0]?.indikatorId;
                queryClient.invalidateQueries({ queryKey: ["indicators"] });
                if (indikatorId) {
                    queryClient.invalidateQueries({ queryKey: ["indicator", indikatorId] });
                    queryClient.invalidateQueries({ queryKey: ["answers", indikatorId] });
                }
            },
        });
    }

    return {
        fetchAllJawaban,
        createAnswer,
    }
}