import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import CircularSlider from 'react-native-circular-slider';

export default function MoodSlider() {
  const [mood, setMood] = useState(50); // 0-100 scale, for instance

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>
      <CircularSlider
        value={mood}
        onChange={(newValue: number) => setMood(newValue)}
        strokeWidth={10}
        strokeColor="#007AFF"
        backgroundColor="#eee"
        size={250}
      />
      <Text style={styles.moodText}>Mood: {mood}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  moodText: {
    fontSize: 18,
    marginTop: 20,
  },
});
