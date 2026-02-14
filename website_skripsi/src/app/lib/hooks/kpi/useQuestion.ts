import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { CreateKontrakKerja, UpdateKontrakKerja } from "../../types/kontrak/kontrakTypes";
import { QuestionCreateForm } from "../../types/kpi/kpiTypes";

const API = process.env.NEXT_PUBLIC_API_URL;

export const useQuestion = () => {
    const fetchAllQuestion = (filters?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        kategori?: string;
        aktif?: boolean;
        minStartDate?: string;
        maxEndDate?: string;
        searchTerm?: string;
    }) => {
        return useQuery({
            queryKey: ["questions", filters],
            queryFn: async () => {
                const token =  Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const queryParams = new URLSearchParams();
                if (filters?.page) queryParams.append("page", filters.page.toString());
                if (filters?.limit) queryParams.append("limit", filters.limit.toString());
                if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
                if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
                if (filters?.kategori) queryParams.append("kategori", filters.kategori);
                if (filters?.aktif) queryParams.append("aktif", filters.aktif.toString());
                if (filters?.minStartDate) queryParams.append("minStartDate", filters.minStartDate);
                if (filters?.maxEndDate) queryParams.append("maxEndDate", filters.maxEndDate);
                if (filters?.searchTerm) queryParams.append("searchTerm", filters.searchTerm);

                const response = await fetch(`${API}/questions?${queryParams.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch questions kpi"
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

    const fetchIdQuestion = (id: string) => {
        return useQuery ({
            queryKey: ["question", id],
            queryFn: async () => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/questions/${id}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch question by Id"
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
            enabled: !!id,
            staleTime: 5 * 60 * 1000,
        });
    }

    const createQuestion = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            QuestionCreateForm[]
        >({
            mutationFn: async (questionData: QuestionCreateForm[]) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/questions`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                    body: JSON.stringify(questionData),
                });

                if (!response.ok) {
                    let errorMessage = "Failed to create kontrak";
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
                    queryClient.invalidateQueries({ queryKey: ["questions", indikatorId] });
                }
            },
        });
    }

    const updateQuestion = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            { id: string; questionData: QuestionCreateForm; }
        >({
            mutationFn: async ({ id, questionData}) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/questions/${id}`,{
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                    body: JSON.stringify(questionData),
                });

                if (!response.ok) {
                    let errorMessage = "Failed to update kontrak";
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                    } catch {
                        errorMessage = response.statusText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }
                
                const result = await response.json();
                return result;
            },
            onSuccess: (variables) => {
                const indikatorId = variables[0]?.indikatorId;
                queryClient.invalidateQueries({ queryKey: ["indicators"] });
                if (indikatorId) {
                    queryClient.invalidateQueries({ queryKey: ["indicator", indikatorId] });
                    queryClient.invalidateQueries({ queryKey: ["questions", indikatorId] });
                }
            },
        });
    }
    const deleteQuestion = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            string
        >({
            mutationFn: async (id: string) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/questions/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || "Failed to delete question");
                }

                return true;
            },

            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["questions"] });
            },
        });
    };

    return {
        fetchAllQuestion,
        fetchIdQuestion,
        deleteQuestion,
        createQuestion,
        updateQuestion,
    }
}