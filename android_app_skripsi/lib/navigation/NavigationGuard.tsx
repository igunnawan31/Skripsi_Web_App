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
    }, [segments, isAuthenticated, router]);

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
            try {
                const res = await originalFetch(...args);

                if (res.status === 401) {
                    await logoutAndClear();
                    router.replace("/(auth)/loading-screen");
                    return new Response(JSON.stringify({ data: [] }), { status: 401 });
                }

                return res;
            } catch {
                await logoutAndClear();
                router.replace("/(auth)/loading-screen");
                return new Response(JSON.stringify({ data: [] }), { status: 500 });
            }
        };

        return () => {
            global.fetch = originalFetch;
        }
    }, []);

    return null;
}