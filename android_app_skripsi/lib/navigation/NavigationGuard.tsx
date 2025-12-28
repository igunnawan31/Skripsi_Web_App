import { useRouter, useSegments } from "expo-router";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

export function NavigationGuard() {
    const router = useRouter();
    const segments = useSegments();
    const { isAuthenticated } = useAuthStore();

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

    return null;
}