import { decodeJwtExpMs } from "@/app/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

const API = "http://localhost:4000";

export async function POST(request: NextRequest) {
    const body = await request.json();

    const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    const accessToken = data.access_token as string;
    const refreshToken = data.refresh_token as string;
    const user = data.user as { majorRole: string; minorRole: string };

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

    res.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
    });

    res.cookies.set("majorRole", user.majorRole, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        expires: accessExpirationDate,
    });

    res.cookies.set("minorRole", user.minorRole, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        expires: accessExpirationDate,
    });

    return res;
}