import { Stack } from "expo-router";
import SafeScreen from "@/components/SafeScreen";
import { StatusBar } from "react-native";
import { NavigationGuard } from "@/lib/navigation/NavigationGuard";
import QueryProvider from "@/lib/providers/queryProvider";
import { AppAuthBootstrap } from "@/lib/navigation/AppAuthBootstrap";

export default function RootLayout() {
  return (
    <SafeScreen>
      <QueryProvider>
        <AppAuthBootstrap>
          <NavigationGuard />
          <StatusBar backgroundColor="#000000"/>
          <Stack screenOptions={{ headerShown: false }}>
            {/* <StatusBar backgroundColor="#000000"/> */}
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(cuti)" />
            <Stack.Screen name="(gaji)/gaji" />
            <Stack.Screen name="(kpi)" />
            <Stack.Screen name="(reimburse)/reimburse/reimburse" />
            <Stack.Screen name="(absensi)" />
            <Stack.Screen name="(calendar)/[id]/index" />
            <Stack.Screen name="(profile)/change-password/index" />
            <Stack.Screen name="(team)" />
          </Stack>
        </AppAuthBootstrap>
      </QueryProvider>
    </SafeScreen>
  );
}
