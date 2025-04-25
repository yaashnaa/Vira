import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function NutritionTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#A084DC", // Purple when selected
        tabBarInactiveTintColor: "#8e8e8e", // Gray when not selected
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
        }}
      />
    </Tabs>
  );
}
