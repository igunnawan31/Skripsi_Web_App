import { Slot } from "expo-router";
import SafeScreen from "@/components/SafeScreen";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <SafeScreen>
      <Slot />
    </SafeScreen>
  );
}