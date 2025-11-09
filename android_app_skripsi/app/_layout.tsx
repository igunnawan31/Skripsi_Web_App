import { Stack } from "expo-router";
import SafeScreen from "@/components/SafeScreen";

export default function RootLayout() {
  return (
    <SafeScreen>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(cuti)" />
        <Stack.Screen name="(kpi)" />
        <Stack.Screen name="(reimburse)" />
        <Stack.Screen name="(absensi)" />
      </Stack>
    </SafeScreen>
  );
}
