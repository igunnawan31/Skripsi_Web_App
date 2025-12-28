import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { getTokens } from "../utils/secureStorage";
import { ActivityIndicator, View } from "react-native";

export function AppAuthBootstrap({children} : {children: React.ReactNode}) {
    const [ready, setReady] = useState(false);
    const {loginSuccess, logout} = useAuthStore();

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const tokens = await getTokens();
                if (tokens?.access_token && tokens?.refresh_token && tokens?.user_id) {
                    loginSuccess(tokens.access_token, tokens.refresh_token, {id: tokens.user_id});
                } else {
                    logout();
                }
            } catch (err) {
                
            } finally {
                if (mounted) setReady(true);
            }
        }) ();

        return () => {
            mounted = false;
        };
    }, [loginSuccess, logout]);
    
    if (!ready) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator />
            </View>
        );
    }

    return <>{children}</>;
}