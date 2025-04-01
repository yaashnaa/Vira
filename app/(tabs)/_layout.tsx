// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs  screenOptions={{
        animation: 'shift',
        headerShown: false
      }}>
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="nurtition" options={{ title: "Nurtition" }} />
      <Tabs.Screen name="mood" options={{ title: "Mood" }} />
      <Tabs.Screen name="fitness" options={{ title: "Fitness" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
