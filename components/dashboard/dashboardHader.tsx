// 1. DashboardHeader.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";

dayjs.extend(dayOfYear); // ⬅️ this line must come immediately after the import


const greetings = [
  "Wishing you a calm and kind day 🌸",
  "You are doing better than you think 🌟",
  "Small steps are powerful too 🌿",
  "Your feelings are valid today 💖",
  "Be gentle with yourself today ☀️",
  "You are enough, just as you are 🍃",
  "Sending you strength and warmth 🌼",
];

export default function DashboardHeader({ userName }: { userName: string }) {
  const todayIndex = dayjs().dayOfYear() % greetings.length;
  return (
    <View style={styles.overlay}>
      <Text style={styles.greetingText}>Hello, {userName}!</Text>
      <Text style={styles.subGreeting}>{greetings[todayIndex]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 16,
    borderRadius: 16,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: "PatrickHand-Regular",
    color: "#271949",
  },
  subGreeting: {
    fontSize: 16,
    color: "#5a4c7c",
    marginTop: 4,
    fontFamily: "Main-font",
  },
});
