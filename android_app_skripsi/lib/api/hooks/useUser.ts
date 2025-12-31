import { useAuthStore } from "@/lib/store/authStore";
import { getTokens } from "@/lib/utils/secureStorage";
import { MajorRole, MinorRole } from "@/types/enumTypes";
import { UserResponse } from "@/types/user/userTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useUser = () => {
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

    const updatePhoto = () => {
        const queryClient = useQueryClient();
        const setUser = useAuthStore((state) => state.user);

        return useMutation({
            mutationFn: async ({ id, photo }: { id: string; photo: any }) => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!jwt) throw new Error("No access token found");

                const form = new FormData();
                form.append("photo", photo);

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${id}`, {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                    body: form,
                });

                if (!response.ok) {
                    let errorMessage = "Failed to update photo";
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
            onSuccess: (data) => {
                const currentUser = useAuthStore.getState().user;
                if (currentUser && data.photo?.path) {
                    setUser({ ...currentUser, photo: data.photo.path });
                }
                queryClient.invalidateQueries({ queryKey: ["users"] });
            },
        });
    };

    return {
        fetchUserById,
        updateUser,
        updatePhoto,
    }
}