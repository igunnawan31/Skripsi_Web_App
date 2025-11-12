import { Stack } from "expo-router";
import SafeScreen from "@/components/SafeScreen";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <SafeScreen>
      {/* <StatusBar backgroundColor="#000000"/> */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(cuti)" />
        <Stack.Screen name="(kpi)" />
        <Stack.Screen name="(reimburse)" />
        <Stack.Screen name="(absensi)" />
        <Stack.Screen name="(calendar)" />
      </Stack>
    </SafeScreen>
  );
}
