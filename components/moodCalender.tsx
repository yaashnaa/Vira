import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useMoodContext } from "../context/moodContext";
import dayjs from "dayjs";

export default function MoodCalendar() {
  const { dailyMoods } = useMoodContext();

  // Turn the object into an array of { date, mood }
  const moodEntries = Object.keys(dailyMoods).map((date) => ({
    date,
    mood: dailyMoods[date],
  }));

  // Sort by date (descending, optional)
  moodEntries.sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Calendar</Text>
      <FlatList
        data={moodEntries}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.mood}>Mood: {item.mood}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 50 },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  date: {
    fontSize: 16,
    fontWeight: "600",
  },
  mood: {
    fontSize: 16,
  },
});
