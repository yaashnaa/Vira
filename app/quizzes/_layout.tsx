
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right", // or "fade", "none", "slide_from_bottom"
        headerShown: false,
        
      }}
    />
  );
}
