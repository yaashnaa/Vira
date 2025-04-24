import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useMoodContext } from "../context/moodContext";
import { Calendar } from "react-native-calendars";

const moodImages = {
  "Feeling Great": require("../assets/images/mood/vhappy.png"),
  "Pretty Good": require("../assets/images/mood/happy.png"),
  "Hanging in There": require("../assets/images/mood/neutral.png"),
  "Not My Best": require("../assets/images/mood/sad.png"),
  "Having a Tough Day": require("../assets/images/mood/vsad.png"),
};
const moodLabels: Record<number, keyof typeof moodImages> = {
  0: "Feeling Great",
  25: "Pretty Good",
  50: "Hanging in There",
  75: "Not My Best",
  100: "Having a Tough Day",
};

export default function MoodCalendar() {
  const { fetchAllMoods, userId } = useMoodContext();
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      const allMoods = await fetchAllMoods();
      const marked: { [key: string]: any } = {};

      allMoods.forEach((entry) => {
        const discreteMood = Math.round(entry.mood / 25) * 25;
        marked[entry.date] = {
          customStyles: {
            container: { backgroundColor: "transparent" },
            text: { display: "none" },
          },
          mood: discreteMood,
        };
      });

      setMarkedDates(marked);
    };

    load();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Calendar</Text>
      <Calendar
        markingType={"custom"}
        markedDates={markedDates}
        dayComponent={({
          date,
          marking,
        }: {
          date: { day: number };
          marking?: { mood?: number };
        }) => {
          const mood = marking?.mood;
          return (
            <View style={styles.dayContainer}>
              <Text style={styles.dayText}>{date.day}</Text>
              {mood !== undefined && (
                <Image
                  source={moodImages[moodLabels[mood]]}
                  style={styles.moodIcon}
                />
              )}
            </View>
          );
        }}
        style={styles.calendar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Main-font",
  },
  calendar: {
    borderRadius: 12,
    overflow: "hidden",
  },
  dayContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    fontSize: 14,
    color: "#333",
  },
  moodIcon: {
    width: 34,
    height: 34,
    marginTop: 4,
    resizeMode: "contain",
  },
});
