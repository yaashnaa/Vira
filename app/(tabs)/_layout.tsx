import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6b4c9a",
        headerShown: false,
        animation: "fade",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null, // 🚫 this will hide it from the tab bar
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          tabBarLabel: "Community",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Feather name="users" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="widgets"
        options={{
          tabBarLabel: "Widgets",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Feather name="grid" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="settings" color={color} size={size + 3} />
          ),
        }}
      />
    </Tabs>
  );
}
