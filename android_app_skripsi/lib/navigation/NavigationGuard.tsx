import { useRouter, useSegments } from "expo-router";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

export function NavigationGuard() {
    const router = useRouter();
    const segments = useSegments();
    const { isAuthenticated, logoutAndClear } = useAuthStore();

    useEffect(() => {
        const inAuthGroup = segments[0] === "(auth)";

        if (!isAuthenticated && !inAuthGroup) {
            router.replace("/(auth)/loading-screen");
            return;
        }

        if (isAuthenticated && inAuthGroup) {
            router.replace("/(tabs)/home");
            return;
        }
    }, [segments, isAuthenticated]);

    useEffect(() => {
        const unsub = useAuthStore.subscribe(async (state) => {
            if (!state.isAuthenticated && segments[0] !== "(auth)") {
                router.replace("/(auth)/loading-screen");
            }
        });
        return () => unsub();
    }, [segments]);

    useEffect(() => {
        const originalFetch = fetch;
        global.fetch = async (...args) => {
            let url: string;
            const requestInfo = args[0];
            
            if (typeof requestInfo === 'string') {
                url = requestInfo;
            } else if (requestInfo instanceof Request) {
                url = requestInfo.url;
            } else {
                url = requestInfo?.toString() || "";
            }

            const isLoginAttempt = url.includes('/auth/login');

            try {
                const res = await originalFetch(...args);
                if (res.status === 401 && !isLoginAttempt) {
                    await logoutAndClear();
                    router.replace("/(auth)/loading-screen");
                    return new Response(JSON.stringify({ data: [] }), { status: 401 });
                }

                return res;
            } catch (err) {
                if (!isLoginAttempt) {
                    await logoutAndClear();
                    router.replace("/(auth)/loading-screen");
                }
                throw err;
            }
        };

        return () => { global.fetch = originalFetch; }
    }, []);

    return null;
}