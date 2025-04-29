// components/Journal/DailyPrompt.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import dayjs from "dayjs";

const prompts = [
  "What made you smile today?",
  "Is there something weighing on your mind?",
  "Describe a moment you felt proud recently.",
  "What’s something you’re grateful for right now?",
  "What do you need more of today?",
  "Name one small win from today.",
  "What would you like to let go of?",
];

export default function DailyPrompt() {
  const index = dayjs().day() % prompts.length;
  const todayPrompt = prompts[index];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>✨ Prompt of the Day</Text>
      <Text style={styles.prompt}>{todayPrompt}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fcf5f5",
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94618e",
    marginBottom: 4,
    fontFamily: "Main-font",
  },
  prompt: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#333",
    fontFamily: "Main-font",
  },
});
