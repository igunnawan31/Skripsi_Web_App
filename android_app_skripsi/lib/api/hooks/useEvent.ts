import { getTokens } from "@/lib/utils/secureStorage";
import { CreateEventRequest, UpdateOccurrences } from "@/types/event/eventTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const useEvent = () => {
    const fetchAllEvents = (filters?: {
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
            queryKey: ["events", filters],
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
                if (filters?.frequency) queryParams.append("frequency", filters.frequency);
                if (filters?.minEventDate) queryParams.append("minEventDate", filters.minEventDate);
                if (filters?.maxEventDate) queryParams.append("maxEventDate", filters.maxEventDate);

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/agendas?${queryParams.toString()}`, {
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

    const fetchEventById = (id: string) => {
        return useQuery({
            queryKey: ["event", id],
            queryFn: async() => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");
                
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/agendas/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch event by ID"
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

    const createEvents = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            CreateEventRequest
        >({
            mutationFn: async (eventData: CreateEventRequest) => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");

                const fd = new FormData();
                fd.append("title", eventData.title);
                fd.append("eventDate", eventData.eventDate);
                fd.append("projectId", String(eventData.projectId));
                fd.append("frequency", String(eventData.frequency));

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/agendas`, {
                    method: "POST",
                    headers: { 
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                    body: fd,
                });

                if (!response.ok) {
                    let errorMessage = "Failed to create event";
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                    } catch {
                        errorMessage = response.statusText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }

                const result = await response.json();
                return result.data;
            },

            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["events"]});
            },
        });
    }

    const updateEvents = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            {id: string; eventData: CreateEventRequest}
        >({
            mutationFn: async ({id, eventData}) => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/agendas/${id}`, {
                    method: "PATCH",
                    headers: { 
                        "Authorization": `Bearer ${jwt}`,
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(eventData),
                });

                if (!response.ok) {
                    let errorMessage = "Failed to update event";
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
                queryClient.invalidateQueries({ queryKey: ["events"]});
            },
        });
    }

    const updateOccurrences = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            {id: string; occurrencesData: UpdateOccurrences}
        >({
            mutationFn: async ({id, occurrencesData}) => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/agendas/occurrences/${id}`, {
                    method: "PATCH",
                    headers: { 
                        "Authorization": `Bearer ${jwt}`,
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(occurrencesData),
                });

                if (!response.ok) {
                    let errorMessage = "Failed to update event";
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
                queryClient.invalidateQueries({ queryKey: ["events"]});
            },
        });
    }

    const deleteEvent = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            string
        >({
            mutationFn: async (id: string) => {
                const token = await getTokens();
                const jwt = token?.access_token;
                if (!token?.access_token) throw new Error("No access token found");

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/agendas/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${jwt}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to delete event";
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                    } catch {
                        errorMessage = response.statusText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }

                return true;
            },

            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["events"] });
            },
        });   
    }

    return {
        fetchAllEvents,
        fetchEventById,
        createEvents,
        updateEvents,
        updateOccurrences,
        deleteEvent
    }
}