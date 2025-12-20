import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { MajorRole, MinorRole } from "../../types/types";

const API = process.env.NEXT_PUBLIC_API_URL;

export const useUser = () => {
    const fetchAllUser = (filters?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        majorRole?: string;
        minorRole?: string;
        searchTerm?: string;
    }) => {
        return useQuery({
            queryKey: ["users", filters],
            queryFn: async () => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const queryParams = new URLSearchParams();
                if (filters?.page) queryParams.append("page", filters.page.toString());
                if (filters?.limit) queryParams.append("limit", filters.limit.toString());
                if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
                if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
                if (filters?.majorRole) queryParams.append("majorRole", filters.majorRole);
                if (filters?.minorRole) queryParams.append("minorRole", filters.minorRole);
                if (filters?.searchTerm) queryParams.append("searchTerm", filters.searchTerm);
                
                const response = await fetch(`${API}/users?${queryParams.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "Failed to fetch project");
                }

                return response.json();
            },
            staleTime: 5 * 60 * 1000,
        });
    }
    
    const fetchUserById = (id: string) => {
        return useQuery ({
            queryKey: ["user", id],
            queryFn: async () => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/users/${id}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "Failed to fetch user by ID");
                }

                return response.json();
            },
            enabled: !!id,
            staleTime: 5 * 60 * 1000,
        });
    }

    const CreateUser = () => {

    }

    const UpdateUser = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            { id: string; name: string; email: string; majorRole: MajorRole; minorRole: MinorRole;}
        >({
            mutationFn: async({ id, name, email, majorRole, minorRole}) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/users/${id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                    body: JSON.stringify({name, email, majorRole, minorRole}),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "Failed to update user");
                }

                return response.json();
            },

            onSuccess: (data, variables) => {
                queryClient.invalidateQueries({ queryKey: ["user", variables.id]});
                queryClient.invalidateQueries({ queryKey: ["users"]})
            },
        })
    }

    const DeleteUser = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            string
        >({
            mutationFn: async (id: string) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/users/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || "Failed to delete user");
                }

                return true;
            },

            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["users"] });
            },
        })
    }

    return {
        fetchAllUser,
        fetchUserById,
        CreateUser,
        UpdateUser,
        DeleteUser,
    }
}