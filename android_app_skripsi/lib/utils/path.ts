import { getTokens } from "./secureStorage";

export const getImageUrl = (filePath: string) => {
    return `${process.env.EXPO_PUBLIC_API_URL}/files/path?${filePath}`;
};

export const getPDFUrl = (filePath: string) => {
    return `${process.env.EXPO_PUBLIC_API_URL}/files/path?${filePath}`;
};

export const fetchFileBlob = async (path: string) => {
    const token = await getTokens();
    const jwt = token?.access_token
    if (!jwt) throw new Error("Unauthorized: No token");

    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/files?path=${path}`, {
        headers: {
            "Authorization": `Bearer ${jwt}`,
        },
    });

    if (!res.ok) {
        let errorMessage = "Failed to fetch blob"
        try {
            const errorData = await res.json();
            errorMessage = errorData.response?.message || errorData.message || errorMessage;
        } catch {
            errorMessage = res.statusText || errorMessage;
        }
        throw new Error(errorMessage);
    }
    return res.blob();
};