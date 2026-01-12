import { useAbsen } from "@/context/AbsenContext";
import { getTokens } from "@/lib/utils/secureStorage";
import { WorkStatus } from "@/types/enumTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAbsensi = () => {
    const fetchAbsensiByUserId = (id: string, year: number, month: number) => {
        return useQuery({
            queryKey: ["absen", id, year, month],
            queryFn: async () => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/absensi/${id}?year=${year}&month=${month}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch absensi by ID";
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
            enabled: !!id && year >= 0 && month >= 0,
            staleTime: 5 * 60 * 1000,
        });
    }

    const fetchAbsensiById = (id: string, date: string) => {
        return useQuery({
            queryKey: ["absen-single", id, date],
            queryFn: async () => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/absensi/single/${id}?date=${date}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch absensi by ID";
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
            enabled: !!id && !!date,
            staleTime: 5 * 60 * 1000,
        })
    }

    const checkIn = () => {
        const queryClient = useQueryClient();
        const { location, photoUrl } = useAbsen();

        return useMutation({
            mutationFn: async () => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!jwt) throw new Error("No access token found");
                
                const form = new FormData();
                form.append("workStatus", "WFO");
                form.append("address", location.address);
                form.append("latitude", String(location.latitude));
                form.append("longitude", String(location.longitude));
                form.append("photo", {
                    uri: photoUrl,
                    name: `absen-${Date.now()}.jpeg`,
                    type: "image/jpeg"
                } as any);
                console.log(form);

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/absensi`,{
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${jwt}`,
                    },
                    body: form,
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
                queryClient.invalidateQueries({ queryKey: ["absen"] });
            },
        })
    }

    const checkOut = () => {
        const queryClient = useQueryClient();
        const { photoUrl } = useAbsen();
        
        return useMutation({
            mutationFn: async ({id} : {id: string;}) => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!jwt) throw new Error("No access token found");
                
                const form = new FormData();
                form.append("photo", {
                    uri: photoUrl,
                    name: `absen-${Date.now()}.jpeg`,
                    type: "image/jpeg"
                } as any);

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/absensi/${id}`,{
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${jwt}`,
                    },
                    body: form,
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
                queryClient.invalidateQueries({ queryKey: ["absen"] });
            },
        })
    }

    return {
        fetchAbsensiByUserId,
        fetchAbsensiById,
        checkIn,
        checkOut,
    }
}