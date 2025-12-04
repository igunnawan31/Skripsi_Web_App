
import { useRouter } from "next/router"
import { useAuthStore } from "../../stores/authStores";
import { loginRequest } from "../../api/auth/auth.api";
import { MajorRole, MinorRole } from "../../types/types";


export const useAuth = () => {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const redirectBasedOnRole = (majorRole: MajorRole, minorRole: MinorRole) => {
        if (majorRole === MajorRole.OWNER) {
            return "/dashboard/(owner)";
        };
        if (majorRole === MajorRole.KARYAWAN) {
            if (minorRole === MinorRole.HR) {
                return "/dashboard/(hr)";
            }
        }

        return "/";
    };

    const login = async(email: string, password: string) => {
        const data = await loginRequest(email, password);
        setAuth(data.access_token, data.user);
        
        const { majorRole, minorRole } = data.user;
        const targetUrl = redirectBasedOnRole(majorRole, minorRole);

        router.push(targetUrl);
    };

    const logout = () => {
        clearAuth();
        router.push("/");
    };

    return {
        login,
        logout,
    };
};