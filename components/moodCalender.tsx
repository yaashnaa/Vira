import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useMoodContext } from "../context/moodContext";

export default function MoodCalendar() {
  const { fetchAllMoods, userId } = useMoodContext(); // ✅ pull in userId
  const [moodEntries, setMoodEntries] = useState<{ date: string; mood: number }[]>([]);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      const allMoods = await fetchAllMoods();
      
      allMoods.sort((a, b) => (a.date < b.date ? 1 : -1));
      setMoodEntries(allMoods);
    };
    load();
  }, [userId]); // ✅ re-run when userId becomes available

  return (
    <View style={{ flex: 1, padding: 20 }}>
    <Text style={{ fontSize: 18, marginBottom: 10 }}>Mood Calendar</Text>
    <FlatList
      data={moodEntries}
      keyExtractor={(item) => item.date}
      renderItem={({ item }) => (
        <View style={{ padding: 10, marginBottom: 5, backgroundColor: "#eee", borderRadius: 8 }}>
          <Text>{item.date}: Mood {item.mood}</Text>
        </View>
      )}
    />
  </View>
  );
}
