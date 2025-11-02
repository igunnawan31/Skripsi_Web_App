import { Stack } from "expo-router";
import Tabs from "@/components/rootComponents/Tabs";

export default function CutiLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}