import { getTokens } from "@/lib/utils/secureStorage";
import { useQuery } from "@tanstack/react-query";

export const useSalary = () => {
    const fetchAllSalary = (filters?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        status?: string;
        minDueDate?: string;
        maxDueDate?: string;
        majorRole?: string;
        minorRole?: string;
        searchTerm?: string;
    }) => {
        return useQuery({
            queryKey: ["salaries", filters],
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
                if (filters?.majorRole) queryParams.append("majorRole", filters.majorRole);
                if (filters?.minorRole) queryParams.append("minorRole", filters.minorRole);
                if (filters?.minDueDate) queryParams.append("minDueDate", filters.minDueDate);
                if (filters?.maxDueDate) queryParams.append("maxDueDate", filters.maxDueDate);
                if (filters?.searchTerm) queryParams.append("searchTerm", filters.searchTerm);

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/salaries?${queryParams.toString()}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch salaries";
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

    const fetchSalaryById = (id: string) => {
        return useQuery({
            queryKey: ["salary", id],
            queryFn: async() => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");
                
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URLcuti}/salaries/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch salary by ID"
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

    return {
        fetchAllSalary,
        fetchSalaryById
    }
}