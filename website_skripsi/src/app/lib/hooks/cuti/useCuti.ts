import { useMutation } from "@tanstack/react-query";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const useCuti = () => {
    const fetchAllCuti = useMutation<
        {access_token: string; cuti: any[]},
        Error,
        void
    >({
        mutationFn: async () => {
            const response = await fetch(`${API}/cuti`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to fetch cuti data");
            }

            return response.json();
        },

        onSuccess: (data) => {
            console.log("Fetched cuti data:", data.cuti);
        },

        onError: (error) => {
            console.error("Error fetching cuti data:", error);
        },
    });

    const fetchCutiById = useMutation<
        {access_token: string; cuti: any},
        Error,
        { id: string }
    >({
        mutationFn: async ({ id }) => {
            const response = await fetch(`${API}/cuti/${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to fetch cuti data by ID");
            }

            return response.json();
        },

        onSuccess: (data) => {
            console.log("Fetched cuti data by ID:", data.cuti);
        },

        onError: (error) => {
            console.error("Error fetching cuti data by ID:", error);
        },
    });

    

}