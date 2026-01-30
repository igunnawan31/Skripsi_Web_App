import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { PaySalary } from "../../types/gaji/gajiTypes";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const useGaji = () => {
    const fetchAllSalaries = (filters?: {
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
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

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

                const response = await fetch(`${API}/salaries?${queryParams.toString()}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "Failed to fetch salary");
                }

                return response.json();
            },
            staleTime: 5 * 60 * 1000,
        });
    }

    const fetchSalaryById = (id: string) => {
        return useQuery ({
            queryKey: ["salary", id],
            queryFn: async () => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/salaries/${id}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "Failed to fetch salary by ID");
                }

                return response.json();
            },
            enabled: !!id,
            staleTime: 5 * 60 * 1000,
        });
    }
    
    const paySalary = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            {id: string; salaryData: PaySalary}
        >({
            mutationFn: async ({ id, salaryData }) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const fd = new FormData();

                if (salaryData.paychecks?.length) {
                    salaryData.paychecks.forEach(file => {
                        fd.append('paychecks', file);
                    });
                }

                const response = await fetch(`${API}/salaries/${id}/pay`,{
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                    body: fd,
                });

                if (!response.ok) {
                    let errorMessage = "Failed to pay salary";
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
                queryClient.invalidateQueries({ queryKey: ["salary", variables.id]});
                queryClient.invalidateQueries({ queryKey: ["salaries"]})
            },
        })
    }

    return {
        fetchAllSalaries,
        fetchSalaryById,
        paySalary,
    };
}