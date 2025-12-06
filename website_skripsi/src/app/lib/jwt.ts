
export function decodeJwt(token: string): { sub?: string; exp?: number; [k: string]: unknown } | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const json = Buffer.from(base64, "base64").toString("utf8");
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export function decodeJwtExpMs(token: string): number | null {
    const p = decodeJwt(token);
    return p?.exp ? p.exp * 1000 : null;
}
