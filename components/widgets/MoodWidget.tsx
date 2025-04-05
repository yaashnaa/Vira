import React from "react";
import { useRouter, Link } from "expo-router";
import WidgetCard from "../widgetCard";
import { Icon } from "@rneui/themed";
import { Pressable, StyleSheet, View } from "react-native";

interface MoodWidgetProps {
  onRemove?: () => void;
}
const MoodWidget: React.FC<MoodWidgetProps> = ({ onRemove }) => {
  const router = useRouter();
  const handlePress = () => {
    router.replace("/mood");
  };

  return (
    <View style={styles.container}>
      {onRemove && (
        <Pressable onPress={onRemove} style={styles.removeIcon}>
          <Icon name="minus-circle" type="feather" color="#c13e6a" size={20} />
        </Pressable>
      )}
      <WidgetCard
        title="Mood Tracker"
        imageSource={require("../../assets/images/widgets/mood.png")}
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
    top: 25,
    right: 19,
    zIndex: 1,
  },
});

export default MoodWidget;
