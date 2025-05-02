import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

export default function NutritionTabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#A084DC",
        tabBarInactiveTintColor: "#8e8e8e",
        animation: "fade",
      }}
    >
      <Tabs.Screen
        name="log"
        options={{
          title: "Log Meal",
          tabBarLabel: "Log",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" size={size} color={color} />
          ),
          headerLeft: () => (
            <Pressable onPress={() => router.replace('/dashboard')} style={{ marginLeft: 15 }}>
              <Ionicons name="arrow-back" size={24} color="#5a3e9b" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => router.replace('/settings/nutritionMovement')} style={{ marginRight: 15 }}>
              <Ionicons name="settings" size={24} color="#5a3e9b" />
            </Pressable>
          ),
        }}
      />

      <Tabs.Screen
        name="Overview"
        options={{
          title: "Daily Overview",
          tabBarLabel: "Overview",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart" size={size} color={color} />
          ),
          headerLeft: () => (
            <Pressable onPress={() => router.replace('/dashboard')} style={{ marginLeft: 15 }}>
              <Ionicons name="arrow-back" size={24} color="#5a3e9b" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => router.replace('/settings/nutritionMovement')} style={{ marginRight: 15 }}>
              <Ionicons name="settings" size={24} color="#5a3e9b" />
            </Pressable>
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search Food",
          tabBarLabel: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
          headerLeft: () => (
            <Pressable onPress={() => router.replace('/dashboard')} style={{ marginLeft: 15 }}>
              <Ionicons name="arrow-back" size={24} color="#5a3e9b" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => router.replace('/settings/nutritionMovement')} style={{ marginRight: 15 }}>
              <Ionicons name="settings" size={24} color="#5a3e9b" />
            </Pressable>
          ),
        }}
      />

      <Tabs.Screen
        name="Suggestions"
        options={{
          title: "Suggested Recipes",
          tabBarLabel: "Suggestions",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fast-food" size={size} color={color} />
          ),
          headerLeft: () => (
            <Pressable onPress={() => router.replace('/dashboard')} style={{ marginLeft: 15 }}>
              <Ionicons name="arrow-back" size={24} color="#5a3e9b" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => router.replace('/settings/nutritionMovement')} style={{ marginRight: 15 }}>
              <Ionicons name="settings" size={24} color="#5a3e9b" />
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}
