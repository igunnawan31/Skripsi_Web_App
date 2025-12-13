
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { MajorRole, MinorRole } from "../../types/types";
import toast from "react-hot-toast";

const API = "http://localhost:4000";

function redirectBasedOnRole(majorRole?: MajorRole, minorRole?: MinorRole) {
    if (majorRole === MajorRole.OWNER) return "/dashboard";
    if (majorRole === MajorRole.KARYAWAN && minorRole === MinorRole.HR) return "/dashboard";
}

function decodeJwtExpMs(token: string): number | null {
    try {
        const [, payload] = token.split(".");
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const json = JSON.parse(Buffer.from(base64, "base64").toString("utf8"));
        return json?.exp ? json.exp * 1000 : null;
    } catch {
        return null;
    }
}

export const useAuth = () => {
    const router = useRouter();

    const loginMutation = useMutation<
        { access_token: string; refresh_token: string; user: { majorRole: MajorRole; minorRole: MinorRole } },
        Error,
        { email: string; password: string }
    >({
        mutationFn: async ({ email, password }) => {
            const response = await fetch(`${API}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Login failed");
            }
            return response.json();
        },

        onSuccess: (data) => {
            const majorRole = data.user.majorRole;
            const minorRole = data.user.minorRole;

            const allowed = (majorRole === MajorRole.OWNER) || (majorRole === MajorRole.KARYAWAN && minorRole === MinorRole.HR);
            if (!allowed) {
                throw new Error("Your account does not have access to this application.");
                return;
            }

            const expMs = decodeJwtExpMs(data.access_token) ?? Date.now() + 60 * 60 * 1000;
            const expiresDate = new Date(expMs);

            Cookies.set("accessToken", data.access_token, {
                secure: true,
                sameSite: "strict",
                path: "/",
                expires: expiresDate,
            });

            Cookies.set("refreshToken", data.refresh_token, {
                secure: true,
                sameSite: "strict",
                path: "/",
                expires: 7,
            });

            Cookies.set("majorRole", data.user.majorRole, {
                secure: true,
                sameSite: "strict",
                path: "/",
                expires: expiresDate,
            });

            Cookies.set("minorRole", data.user.minorRole, {
                secure: true,
                sameSite: "strict",
                path: "/",
                expires: expiresDate,
            });

            router.push(redirectBasedOnRole(majorRole, minorRole) || "/");
        },
    });

    const logout = async () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("majorRole");
        Cookies.remove("minorRole");
        router.push("/");
    };

    return {
        login: (email: string, password: string) => loginMutation.mutateAsync({ email, password }),
        isLoggingIn: loginMutation.isPending,
        loginError: (loginMutation.error as Error) ?? null,
        logout,
    };
};
