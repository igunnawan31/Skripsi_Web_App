import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { CreateKontrakKerja, UpdateKontrakKerja } from "../../types/kontrak/kontrakTypes";

const API = process.env.NEXT_PUBLIC_API_URL;

export const useKpi = () => {
    const fetchAllIndikator = (filters?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        statusPublic?: string;
        status?: string;
        minStartDate?: string;
        maxEndDate?: string;
        searchTerm?: string;
    }) => {
        return useQuery({
            queryKey: ["indicators", filters],
            queryFn: async () => {
                const token =  Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const queryParams = new URLSearchParams();
                if (filters?.page) queryParams.append("page", filters.page.toString());
                if (filters?.limit) queryParams.append("limit", filters.limit.toString());
                if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
                if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
                if (filters?.status) queryParams.append("status", filters.status);
                if (filters?.statusPublic) queryParams.append("statusPublic", filters.statusPublic);
                if (filters?.minStartDate) queryParams.append("minStartDate", filters.minStartDate);
                if (filters?.maxEndDate) queryParams.append("maxEndDate", filters.maxEndDate);
                if (filters?.searchTerm) queryParams.append("searchTerm", filters.searchTerm);

                const response = await fetch(`${API}/indicators?${queryParams.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch indicators kpi"
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
        })
    }

    const fetchAllQuestionByIdIndikator = ({ id, ...filters }: {
        id: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        kategori?: string;
        aktif?: boolean;
        minStartDate?: string;
        maxEndDate?: string;
        searchTerm?: string;
    }) => {
        return useQuery({
            queryKey: ["indicators-question", id, filters],
            queryFn: async () => {
                const token =  Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const queryParams = new URLSearchParams();
                if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
                if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
                if (filters?.kategori) queryParams.append("kategori", filters.kategori);
                if (filters?.aktif) queryParams.append("aktif", filters.aktif.toString());
                if (filters?.minStartDate) queryParams.append("minStartDate", filters.minStartDate);
                if (filters?.maxEndDate) queryParams.append("maxEndDate", filters.maxEndDate);
                if (filters?.searchTerm) queryParams.append("searchTerm", filters.searchTerm);

                const response = await fetch(`${API}/indicators/${id}/questions?${queryParams.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch indicators kpi"
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
        })
    }

    const fetchIndicatorById = (id: string) => {
        return useQuery ({
            queryKey: ["indicator", id],
            queryFn: async () => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/indicators/${id}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    let errorMessage = "Failed to fetch indicator by Id"
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

    const createKontrak = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            CreateKontrakKerja
        >({
            mutationFn: async (kontrakData: CreateKontrakKerja) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const fd = new FormData();

                fd.append('userData[email]', kontrakData.userData.email || '');
                fd.append('userData[name]', kontrakData.userData.name || '');
                fd.append('userData[password]', kontrakData.userData.password || '');
                fd.append('userData[majorRole]', kontrakData.userData.majorRole || '');
                fd.append('userData[minorRole]', kontrakData.userData.minorRole || '');

                if (kontrakData.userPhoto) {
                    fd.append('userPhoto', kontrakData.userPhoto);
                }

                fd.append('projectData[id]', kontrakData.projectData.id || '');

                fd.append('jenis', kontrakData.jenis || '');
                fd.append('category', kontrakData.metodePembayaran || '');
                fd.append('dpPercentage', String(kontrakData.dpPercentage || 0));
                fd.append('finalPercentage', String(kontrakData.finalPercentage || 0));
                fd.append('totalBayaran', String(kontrakData.totalBayaran));
                fd.append('absensiBulanan', String(kontrakData.absensiBulanan));
                fd.append('cutiBulanan', String(kontrakData.cutiBulanan));
                fd.append('status', kontrakData.status || '');
                fd.append('catatan', kontrakData.catatan || '');
                fd.append('startDate', kontrakData.startDate || '');
                fd.append('endDate', kontrakData.endDate || '');

                if (kontrakData.contractDocuments?.length) {
                    kontrakData.contractDocuments.forEach(file => {
                        fd.append('contractDocuments', file);
                    });
                }

                const response = await fetch(`${API}/kontrak`, {
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

            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["kontraks"] });
            },
        });
    }

    const updateKontrak = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            { id: string; kontrakData: Partial<UpdateKontrakKerja>; }
        >({
            mutationFn: async ({ id, kontrakData}) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const fd = new FormData();

                fd.append('userData[email]', kontrakData?.userData?.email || '');
                fd.append('userData[name]', kontrakData?.userData?.name || '');
                fd.append('userData[password]', kontrakData?.userData?.password || '');
                fd.append('userData[majorRole]', kontrakData?.userData?.majorRole || '');
                fd.append('userData[minorRole]', kontrakData?.userData?.minorRole || '');

                if (kontrakData.userPhoto) {
                    fd.append('userPhoto', kontrakData.userPhoto);
                }

                fd.append('projectData[id]', kontrakData?.projectData?.id || '');

                fd.append('jenis', kontrakData.jenis || '');
                fd.append('metodePembayaran', kontrakData.metodePembayaran || '');
                fd.append('dpPercentage', String(kontrakData.dpPercentage || 0));
                fd.append('finalPercentage', String(kontrakData.finalPercentage || 0));
                fd.append('totalBayaran', String(kontrakData.totalBayaran));
                fd.append('absensiBulanan', String(kontrakData.absensiBulanan));
                fd.append('cutiBulanan', String(kontrakData.cutiBulanan));
                fd.append('status', kontrakData.status || '');
                fd.append('catatan', kontrakData.catatan || '');
                fd.append('startDate', kontrakData.startDate || '');
                fd.append('endDate', kontrakData.endDate || '');
                fd.append('removeDocuments', JSON.stringify(kontrakData.removeDocuments || []));

                if (kontrakData.contractDocuments?.length) {
                    kontrakData.contractDocuments.forEach(file => {
                        fd.append('contractDocuments', file);
                    });
                }

                const response = await fetch(`${API}/kontrak/${id}`,{
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
                queryClient.invalidateQueries({ queryKey: ["kontrak", variables.id]});
                queryClient.invalidateQueries({ queryKey: ["kontraks"]})
            },
        });
    }
    const deleteIndikator = () => {
        const queryClient = useQueryClient();

        return useMutation<
            any,
            Error,
            string
        >({
            mutationFn: async (id: string) => {
                const token = Cookies.get("accessToken");
                if (!token) throw new Error("No access token found");

                const response = await fetch(`${API}/indicators/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || "Failed to delete indikator");
                }

                return true;
            },

            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["indicators"] });
            },
        });
    };

    return {
        fetchAllIndikator,
        fetchAllQuestionByIdIndikator,
        fetchIndicatorById,
        deleteIndikator,
        createKontrak,
        updateKontrak,
    }
}