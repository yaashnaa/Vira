// components/community/TabInfoCard.tsx
import React from "react";
import { StyleSheet, Text } from "react-native";
import { Card } from "react-native-paper";

export default function TabInfoCard({ title, description }: { title: string; description: string }) {
  return (
    <Card style={styles.infoCard}>
      <Card.Content>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoText}>{description}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: "#f9e8ff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: "PatrickHand-Regular",
    color: "#3e2a6e",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    fontFamily: "Main-font",
    color: "#4a4a4a",
    lineHeight: 18,
  },
});
