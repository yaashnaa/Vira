// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs  screenOptions={{
        animation: 'shift',
        headerShown: false
      }}>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="track" options={{ title: "Track" }} />
      <Tabs.Screen name="mindfulness" options={{ title: "Mindfulness" }} />
      <Tabs.Screen name="progress" options={{ title: "Progress" }} />
    </Tabs>
  );
}
