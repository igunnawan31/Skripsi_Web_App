import Tabs from "@/components/rootComponents/Tabs";
import { useUser } from "@/lib/api/hooks/useUser";
import { useAuthStore } from "@/lib/store/authStore";
import React from "react";
import { Text } from "react-native";

export default function RootTabsLayout() {
    const userId = useAuthStore((state) => state.user?.id);
    const { data, isLoading, error} = useUser().fetchUserById(userId);
    
    React.useEffect(() => {
        if (data) {
            useAuthStore.getState().setUserProfile(data);
        }
    }, [data]);
    
    return (
        <Tabs />
    )
}
