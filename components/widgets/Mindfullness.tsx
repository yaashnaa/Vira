import React from "react";
import { useRouter, Link } from "expo-router";
import WidgetCard from "../widgetCard";
import { Icon } from "@rneui/themed";
import { Header as HeaderRNE } from "@rneui/themed";
import { Pressable, StyleSheet, View } from "react-native";
interface MindfullnessWidgetProps {
  onRemove?: () => void;
}

const MindfullnessWidget: React.FC<MindfullnessWidgetProps> = ({
  onRemove,
}) => {
  const router = useRouter();
  const handlePress = () => {
    router.replace("/mindfulness");
  };

  return (
    <View style={styles.container}>
      {onRemove && (
        <Pressable onPress={onRemove} style={styles.removeIcon}>
          <Icon name="minus-circle" type="feather" color="#c13e6a" size={20} />
        </Pressable>
      )}
      <WidgetCard
        title="Mindfullness"
        imageSource={require("../../assets/images/widgetImages/yoga.png")}
        onPress={handlePress}
      />
    </View>
  );
};
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

export default MindfullnessWidget;
