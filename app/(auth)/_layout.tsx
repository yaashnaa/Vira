import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "fade", // or "fade", "none", "slide_from_bottom"
        headerShown: false,
      }}
    />
  );
}
