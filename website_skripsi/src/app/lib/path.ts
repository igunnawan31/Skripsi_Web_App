import Cookies from "js-cookie";

export const getImageUrl = (filePath: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/files/path?${filePath}`;
};

export const getPDFUrl = (filePath: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/files/path?${filePath}`;
};

export const fetchFileBlob = async (path: string) => {
    const token = Cookies.get("accessToken");
    if (!token) throw new Error("Unauthorized: No token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files?path=${path}`, {
        headers: {
        "Authorization": `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to load file");
    return res.blob();
};