import WidgetCard from "../widgetCard";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function CBTToolsWidget({
  onRemove,
}: {
  onRemove?: () => void;
}) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {onRemove && (
        <Pressable onPress={onRemove} style={styles.removeIcon}>
       <Feather name="minus-circle" color="#c13e6a" size={20} />

        </Pressable>
      )} 
      <WidgetCard
        title="Thought Log"
        imageSource={require("../../assets/images/widgetImages/notebook.png")}
        onPress={() => router.push("/CBTToolsScreen")}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  removeIcon: {
    position: "absolute",
    top: 18,
    left: 100,
    zIndex: 1,
  },
});
