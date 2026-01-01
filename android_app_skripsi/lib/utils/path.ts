import { getTokens } from "./secureStorage";

export const getImageUrl = (filePath: string) => {
  return `${process.env.EXPO_PUBLIC_API_URL}/files?path=${filePath}`;
};

export const fetchImageWithAuth = async (path: string) => {
    const token = await getTokens();
    const jwt = token?.access_token;
    if (!jwt) throw new Error("No access token");

    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/files?path=${path}`, {
        headers: {
        "Authorization": `Bearer ${jwt}`,
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch image");
    }

    const blob = await res.blob();
    return blob;
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