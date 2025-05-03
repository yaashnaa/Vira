import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useCheckInContext } from "@/context/checkInContext"; // ⬅️ Changed import
import { Calendar } from "react-native-calendars";

type MoodMarking = {
  customStyles: {
    container?: object;
    text?: object;
  };
  mood?: number;
};

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
  const { fetchAllMoods } = useCheckInContext();
  const [markedDates, setMarkedDates] = useState<{
    [key: string]: MoodMarking;
  }>({});

  useEffect(() => {
    (async () => {
      const allMoods = await fetchAllMoods();
      const marked: { [key: string]: any } = {};
      allMoods.forEach(({ date, mood }) => {
        const discrete = Math.round(mood / 25) * 25;
        marked[date] = {
          customStyles: {
            container: { backgroundColor: "transparent" },
            text: { display: "none" },
          },
          mood: discrete,
        };
      });
      setMarkedDates(marked);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Calendar</Text>
      <Calendar
        markingType="custom"
        markedDates={markedDates}
        dayComponent={({ date, marking }) => {
          const customMarking = marking as MoodMarking;
          const mood = customMarking?.mood;

          return (
            <View style={styles.dayContainer}>
              <Text style={styles.dayText}>{date?.day ?? ""}</Text>
              {typeof mood === "number" && moodImages[moodLabels[mood]] && (
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
