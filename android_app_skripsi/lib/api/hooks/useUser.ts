import { useAuthStore } from "@/lib/store/authStore";
import { getTokens } from "@/lib/utils/secureStorage";
import { MajorRole, MinorRole } from "@/types/enumTypes";
import { UserResponse } from "@/types/user/userTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useUser = () => {
    const queryClient = useQueryClient();
    const setUser = useAuthStore((state) => state.setUserProfile);
    
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
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");

                const queryParams = new URLSearchParams();
                if (filters?.page) queryParams.append("page", filters.page.toString());
                if (filters?.limit) queryParams.append("limit", filters.limit.toString());
                if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
                if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
                if (filters?.majorRole) queryParams.append("majorRole", filters.majorRole);
                if (filters?.minorRole) queryParams.append("minorRole", filters.minorRole);
                if (filters?.searchTerm) queryParams.append("searchTerm", filters.searchTerm);
                
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users?${queryParams.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch users"
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
    
    const fetchUserById = (id: string) => {
        return useQuery ({
            queryKey: ["user", id],
            queryFn: async () => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${id}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch user by ID"
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

    const updateUser = () => {
        const queryClient = useQueryClient();

        return useMutation<
            UserResponse,
            Error,
            { id: string; name: string; email: string; majorRole: MajorRole; minorRole: MinorRole; photo: string}
        >({
            mutationFn: async({ id, name, email, majorRole, minorRole, photo}) => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!jwt) throw new Error("No access token found");

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                    body: JSON.stringify({name, email, majorRole, minorRole, photo}),
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch user by ID"
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
                queryClient.invalidateQueries({ queryKey: ["users"]});
            },
        })
    }

    const updatePhoto = (onSuccessCallback?: (data: any) => void) => {
        return useMutation({
            mutationFn: async ({ id, photo }: { id: string; photo: any }) => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!jwt) throw new Error("No access token found");

                const form = new FormData();
                form.append("userPhoto", photo);

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${id}`, {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${jwt}`,
                    },
                    body: form,
                });

                if (!response.ok) {
                    const ct = response.headers.get("content-type") || "";
                    const errBody = ct.includes("application/json")
                        ? await response.json().catch(() => ({}))
                        : await response.text().catch(() => "");
                    const msg = typeof errBody === "string"
                        ? errBody
                        : errBody?.response?.message || errBody?.message || `Failed to update photo (${response.status})`;
                    throw new Error(msg);
                }

                const result = await response.json();
                return result;
            },
            onSuccess: (data) => {
                const currentUser = useAuthStore.getState().user;
                if (currentUser && data.photo?.path) {
                    setUser({ ...currentUser, photo: data.photo.path });
                }
                queryClient.invalidateQueries({ queryKey: ["users"] });
                if (onSuccessCallback) onSuccessCallback(data);
            },
            onError: (error) => {
                console.error("Photo update error:", error.message);
            },
        });
    };

    return {
        fetchAllUser,
        fetchUserById,
        updateUser,
        updatePhoto,
    }
}