import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Icon } from "@rneui/themed";
import WidgetCard from "./widgetCard";

interface WidgetCardWithActionProps {
  title: string;
  imageSource: any;
  onPress?: () => void;
  onAction?: () => void;
  actionIcon?: "plus-circle" | "minus-circle";
  actionColor?: string;
}

export default function WidgetCardWithAction({
  title,
  imageSource,
  onPress,
  onAction,
  actionIcon = "plus-circle",
  actionColor = "#856ab0",
}: WidgetCardWithActionProps) {
  return (
    <View style={styles.container}>
      {onAction && (
        <Pressable onPress={onAction} style={styles.icon}>
          <Icon name={actionIcon} type="feather" color={actionColor} size={20} />
        </Pressable>
      )}
      <WidgetCard title={title} imageSource={imageSource} onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  icon: {
    position: "absolute",
    top: 24,
    right: 25,
    zIndex: 1,
  },
});
