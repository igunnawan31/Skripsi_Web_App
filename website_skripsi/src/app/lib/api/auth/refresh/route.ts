import { decodeJwtExpMs } from "@/app/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function POST(request: NextRequest) {
    const refreshToken = request.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
        return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const response = await fetch(`${API}/auth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
        credentials: "include",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    const accessToken = data.access_token as string;
    const newRefreshToken = data.refresh_token as string | undefined;

    const expirationInMs = decodeJwtExpMs(accessToken) ?? Date.now() + 60 * 60 * 1000;
    const accessExpirationDate = new Date(expirationInMs);
    
    const res = NextResponse.json({ ok: true });
    res.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        expires: accessExpirationDate,
    });

    if (newRefreshToken) {
        res.cookies.set("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });
    };
    
    return res;
}