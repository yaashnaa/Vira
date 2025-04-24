import WidgetCard from "../widgetCard";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Icon } from "@rneui/themed";
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
          <Icon name="minus-circle" type="feather" color="#c13e6a" size={20} />
        </Pressable>
      )}
      <WidgetCard
        title="Thought Reframer"
        imageSource={require("../../assets/images/widgetImages/notebook.png")}
        onPress={() => router.push("/thoughtReframeScreen")}
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
    top: 20,
    right: 20,
    zIndex: 1,
  },
});
