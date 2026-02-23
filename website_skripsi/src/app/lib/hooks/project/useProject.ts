import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { ProjectCreateRequest, ProjectPatchRequest } from "../../types/project/projectTypes";

const API = process.env.NEXT_PUBLIC_API_URL;

export const useProject = () => {
    const fetchAllProject = (filters?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        status?: string;
        minStartDate?: string;
        maxEndDate?: string;
        searchTerm?: string;
    }) => {
        return useQuery({
            queryKey: ["projects", filters],
            queryFn: async () => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const queryParams = new URLSearchParams();
                if (filters?.page) queryParams.append("page", filters.page.toString());
                if (filters?.limit) queryParams.append("limit", filters.limit.toString());
                if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
                if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
                if (filters?.status) queryParams.append("status", filters.status);
                if (filters?.minStartDate) queryParams.append("minStartDate", filters.minStartDate);
                if (filters?.maxEndDate) queryParams.append("maxEndDate", filters.maxEndDate);
                if (filters?.searchTerm) queryParams.append("searchTerm", filters.searchTerm);
                
                const response = await fetch(`${API}/project?${queryParams.toString()}`, {
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
    
    const fetchProjectById = (id: string) => {
        return useQuery ({
            queryKey: ["project", id],
            queryFn: async () => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/project/${id}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "Failed to fetch project by ID");
                }

                return response.json();
            },
            enabled: !!id,
            staleTime: 5 * 60 * 1000,
        });
    }

    const CreateProject = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            ProjectCreateRequest
        >({
            mutationFn: async (projectData: ProjectCreateRequest) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");
                const fd = new FormData();

                fd.append('name', projectData.name || '');
                fd.append('description', projectData.description || '');
                fd.append('startDate', projectData.startDate || '');
                fd.append('endDate', projectData.endDate || '');

                if (projectData.projectDocument?.length) {
                    projectData.projectDocument.forEach(file => {
                        fd.append('projectDocument', file);
                    });
                }

                const response = await fetch(`${API}/project`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                    body: fd,
                });

                if (!response.ok) {
                    let errorMessage = "Failed to create kontrak";
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

            onSuccess: (data) => {
                queryClient.invalidateQueries({ queryKey: ["projects"]});
            },
        });
    }

    const UpdateProject = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            { id: string; projectData: Partial<ProjectPatchRequest>; }
        >({
            mutationFn: async ({ id, projectData }) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");
                const fd = new FormData();

                fd.append('name', projectData.name || '');
                fd.append('description', projectData.description || '');
                fd.append('status', projectData.status || '');
                fd.append('startDate', projectData.startDate || '');
                fd.append('endDate', projectData.endDate || '');
                fd.append('removeDocuments', JSON.stringify(projectData.removeDocuments || []));

                if (projectData.projectDocument?.length) {
                    projectData.projectDocument.forEach(file => {
                        fd.append('projectDocument', file);
                    });
                }

                const response = await fetch(`${API}/project/${id}`, {
                    method: "PATCH",
                    headers: { 
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                    body: fd,
                });

                if (!response.ok) {
                    let errorMessage = "Failed to update kontrak";
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
                queryClient.invalidateQueries({ queryKey: ["project", variables.id]});
                queryClient.invalidateQueries({ queryKey: ["projects"]})
            },
        });
    }

    const DeleteProject = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            string
        >({
            mutationFn: async (id: string) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/project/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || "Failed to delete project");
                }

                return true;
            },

            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["projects"] });
            },
        });
    };


    return {
        fetchAllProject,
        fetchProjectById,
        CreateProject,
        UpdateProject,
        DeleteProject,
    }
}