// fitness/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
export default function FitnessTabsLayout() {
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
        name="explore"
        options={{
          title: "Explore",
          tabBarLabel: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerLeft: () => (
            <Pressable
              onPress={() => router.replace("/dashboard")}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#5a3e9b" />
            </Pressable>
          ),
        }}
        />
    
      <Tabs.Screen
        name="findExercises"
        options={{
          title: "Find Exercises",
          tabBarLabel: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell" size={size} color={color} />
          ),
          headerLeft: () => (
            <Pressable
              onPress={() => router.replace("/dashboard")}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#5a3e9b" />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarLabel: "Favorites",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
          headerLeft: () => (
            <Pressable
              onPress={() => router.replace("/dashboard")}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#5a3e9b" />
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}
