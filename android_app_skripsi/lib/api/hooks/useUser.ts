import { getTokens } from "@/lib/utils/secureStorage";
import { useQuery } from "@tanstack/react-query"

export const useUser = () => {
    const fetchUserById = (id: string) => {
        return useQuery ({
            queryKey: ["user", id],
            queryFn: async () => {
                const token = await getTokens();
                if (!token?.access_token) throw new Error("No access token found");

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${id}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token.access_token}`,
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

    return {
        fetchUserById
    }
}