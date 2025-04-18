import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";

interface WidgetCardProps {
  title: string;
  subtitle?: string;
  imageSource: any;
  onPress?: () => void;
}

export default function WidgetCard({
  title,
  subtitle,
  imageSource,
  onPress,
}: WidgetCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f8f6f4",
    borderRadius: 16,
    padding: 0,
    width: 125,
    height: 125,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    margin: 5,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginBottom: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Main-font",
    color: "#100f0d",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    color: "#1c110d",
    fontFamily: "Comfortaa-Regular",
    marginTop: 4,
    textAlign: "center",
  },
});
