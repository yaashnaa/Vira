// src/components/SettingsItem.tsx
import { List } from "react-native-paper";
import { View } from "react-native";
import { useRouter } from "expo-router";

export default function SettingsItem({ title, icon, route }: { title: string, icon: string, route: string }) {
  const router = useRouter();
  
  return (
    <List.Item
      title={title}
      titleStyle={{
        color: "#2a2a2a",
        fontFamily: "Main-font",
        fontSize: 16,
      }}
      left={() => <List.Icon icon={icon} color="#190028" />}
      right={() => <List.Icon icon="chevron-right" color="#190028" />}
      onPress={() => router.push(route as Parameters<typeof router.push>[0])}
    />
  );
}
