import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { CreateKontrakKerja, UpdateKontrakKerja } from "../../types/kontrak/kontrakTypes";
import { EvalCreateForm, IndikatorCreateForm } from "../../types/kpi/kpiTypes";

const API = process.env.NEXT_PUBLIC_API_URL;

export const useKpi = () => {
    const fetchAllIndikator = (filters?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        statusPublic?: boolean;
        status?: string;
        minStartDate?: string;
        maxEndDate?: string;
        searchTerm?: string;
    }) => {
        return useQuery({
            queryKey: ["indicators", filters],
            queryFn: async () => {
                const token =  Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const queryParams = new URLSearchParams();
                if (filters?.page) queryParams.append("page", filters.page.toString());
                if (filters?.limit) queryParams.append("limit", filters.limit.toString());
                if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
                if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
                if (filters?.status) queryParams.append("status", filters.status);
                if (filters?.statusPublic !== undefined) {queryParams.append("statusPublic", String(filters.statusPublic));}
                if (filters?.minStartDate) queryParams.append("minStartDate", filters.minStartDate);
                if (filters?.maxEndDate) queryParams.append("maxEndDate", filters.maxEndDate);
                if (filters?.searchTerm) queryParams.append("searchTerm", filters.searchTerm);

                console.log(filters?.minStartDate);

                const response = await fetch(`${API}/indicators?${queryParams.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch indicators kpi"
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

    const fetchAllQuestionByIdIndikator = ({ id, ...filters }: {
        id: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        kategori?: string;
        aktif?: boolean;
        minStartDate?: string;
        maxEndDate?: string;
        searchTerm?: string;
    }) => {
        return useQuery({
            queryKey: ["indicators-question", id, filters],
            queryFn: async () => {
                const token =  Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const queryParams = new URLSearchParams();
                if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
                if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
                if (filters?.kategori) queryParams.append("kategori", filters.kategori);
                if (filters?.aktif) queryParams.append("aktif", filters.aktif.toString());
                if (filters?.minStartDate) queryParams.append("minStartDate", filters.minStartDate);
                if (filters?.maxEndDate) queryParams.append("maxEndDate", filters.maxEndDate);
                if (filters?.searchTerm) queryParams.append("searchTerm", filters.searchTerm);

                const response = await fetch(`${API}/indicators/${id}/questions?${queryParams.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch indicators kpi"
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

    const fetchIndicatorById = (id: string) => {
        return useQuery ({
            queryKey: ["indicator", id],
            queryFn: async () => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/indicators/${id}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch indicator by Id"
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

    const createIndikator = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            IndikatorCreateForm
        >({
            mutationFn: async (indikatorData: IndikatorCreateForm) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/indicators`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                    body: JSON.stringify(indikatorData),
                });

                if (!response.ok) {
                    let errorMessage = "Failed to create indicator";
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

            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["indicators"] });
            },
        });
    }

    const createEval = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            {id: string, evalData: EvalCreateForm}
        >({
            mutationFn: async ({id, evalData}) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/indicators/${id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                    body: JSON.stringify(evalData.evalMap),
                });

                if (!response.ok) {
                    let errorMessage = "Failed to create evaluation in indicator";
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

            onSuccess: (id: string) => {
                queryClient.invalidateQueries({ queryKey: ["indicators"] });
                queryClient.invalidateQueries({ queryKey: ["indicator", id] });
            },
        });
    }

    const updateIndikator = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            { id: string; indikatorData: Partial<IndikatorCreateForm>; }
        >({
            mutationFn: async ({ id, indikatorData}) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/indicators/${id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                    body: JSON.stringify(indikatorData),
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
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries({ queryKey: ["indicator", variables.id]});
                queryClient.invalidateQueries({ queryKey: ["indicators"]})
            },
        });
    }
    
    const deleteIndikator = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            string
        >({
            mutationFn: async (id: string) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/indicators/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || "Failed to delete indikator");
                }

                return true;
            },

            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["indicators"] });
            },
        });
    };

    const deleteEval = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            string
        >({
            mutationFn: async (id: string) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/indicators/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || "Failed to delete indikator");
                }

                return true;
            },

            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["indicators"] });
            },
        });
    }

    return {
        fetchAllIndikator,
        fetchAllQuestionByIdIndikator,
        fetchIndicatorById,
        deleteIndikator,
        createIndikator,
        createEval,
        updateIndikator,
    }
}