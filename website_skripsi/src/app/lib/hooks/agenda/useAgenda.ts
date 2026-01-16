import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { CreateAgenda } from "../../types/agendas/agendaTypes";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const useAgenda = () => {
    const fetchAllAgendas = (filters?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        status?: string;
        minEventDate?: string;
        maxEventDate?: string;
        frequency?: string;
    }) => {
        return useQuery({
            queryKey: ["agendas", filters],
            queryFn: async () => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const queryParams = new URLSearchParams();
                if (filters?.page) queryParams.append("page", filters.page.toString());
                if (filters?.limit) queryParams.append("limit", filters.limit.toString());
                if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
                if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
                if (filters?.status) queryParams.append("status", filters.status);
                if (filters?.frequency) queryParams.append("frequency", filters.frequency);
                if (filters?.minEventDate) queryParams.append("minEventDate", filters.minEventDate);
                if (filters?.maxEventDate) queryParams.append("maxEventDate", filters.maxEventDate);

                const response = await fetch(`${API}/agendas?${queryParams.toString()}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "Failed to fetch agendas");
                }

                return response.json();
            },
            staleTime: 5 * 60 * 1000,
        });
    }

    const createAgendas = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            CreateAgenda
        >({
            mutationFn: async (agendaData: CreateAgenda) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/agendas`, {
                    method: "POST",
                    headers: { 
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(agendaData),
                });

                if (!response.ok) {
                    let errorMessage = "Failed to create agenda";
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
                queryClient.invalidateQueries({ queryKey: ["agendas"]});
            },
        });
    }

    return {
        fetchAllAgendas,
        createAgendas
    }
}