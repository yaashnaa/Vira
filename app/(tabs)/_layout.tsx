import { Tabs } from "expo-router";
import { Icon } from "@rneui/themed";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import "react-native-reanimated";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6b4c9a",
        headerShown: false,
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
            <Icon name="home" type="feather" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          tabBarLabel: "Community",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon name="users" type="feather" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="widgets"
        options={{
          tabBarLabel: "Widgets",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon name="grid" type="feather" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon name="settings" type="feather" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
