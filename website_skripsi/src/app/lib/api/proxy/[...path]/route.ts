import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function handler(request: NextRequest, path: string) {
    const accessToken = request.cookies.get("accessToken")?.value || "";
    const url = `${API}/${path}`;

    const method = request.method;
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    };
    
    const init: RequestInit = { method, headers };
    if (method !== "GET" && method !== "HEAD") {
        const body = await request.text();
        init.body = body;
    };

    const response = await fetch(url, init);
    const contentType = response.headers.get("Content-Type") || "";
    const payload = contentType.includes("application/json") 
        ? await response.json().catch(() => ({})) 
        : await response.text();

    return NextResponse.json(payload, { status: response.status });
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
    const path = params.path.join("/");
    return handler(request, path);
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
    const path = params.path.join("/");
    return handler(request, path);
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
    const path = params.path.join("/");
    return handler(request, path);
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
    const path = params.path.join("/");
    return handler(request, path);
}