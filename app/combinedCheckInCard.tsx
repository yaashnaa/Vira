import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Card, Button, Icon } from "react-native-paper";
import { useRouter } from "expo-router";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db, auth } from "@/config/firebaseConfig";
import dayjs from "dayjs";
import { useCheckInContext } from "@/context/checkInContext";
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get("window");

const moodEmoji = {
  "Having a Tough Day": "💭😔",
  "Not My Best": "💭😕",
  "Hanging in There": "💭😐",
  "Pretty Good": "💭🙂",
  "Feeling Great": "💭🌟",
};

const energyEmoji = {
  "Running on Empty": "⚡😴",
  "A Little Tired": "⚡😕",
  "Doing Alright": "⚡🙂",
  "Feeling Energized": "⚡💪",
  "Ready to Take on the Day": "⚡🌞",
};

const sleepEmoji = {
  "Really Struggled": "💤😩",
  "Not the Best": "💤😕",
  "Okay Sleep": "💤😐",
  "Pretty Restful": "💤😊",
  "Slept Like a Baby": "💤🌙",
};

const moodMap = [
  {
    moods: ["Feeling Great"],
    emoji: "😄",
    suggestion: "Try a high-energy workout to celebrate your vibe",
    route: "/fitness",
    label: "Go to Fitness",
  },
  {
    moods: ["Pretty Good"],
    emoji: "😊",
    suggestion: "Maintain that balance with a mindful stretch session🧘",
    route: "/fitness",
    label: "Explore Movement",
  },
  {
    moods: ["Hanging in There"],
    emoji: "😐",
    suggestion: "🚶 Take a short walk or do a light activity to reset",
    route: "/fitness",
    label: "Gentle Workout",
  },
  {
    moods: ["Not My Best"],
    emoji: "😕",
    suggestion: "🫶 Try journaling a few thoughts to release the tension",
    route: "/journal",
    label: "Open Journal",
  },
  {
    moods: ["Having a Tough Day"],
    emoji: "😢",
    suggestion: "🌿 Try a calming breathing exercise to ground yourself",
    route: "/mindfullness",
    label: "Start Breathing",
  },
];
const moodFeelingMap: { [key: string]: string } = {
  "Feeling Great": "great",
  "Pretty Good": "pretty good",
  "Hanging in There": "okay",
  "Not My Best": "a little off",
  "Having a Tough Day": "like you're having a tough day",
};

export default function CombinedCheckInCard() {
  const { moodLabel, energyLabel, sleepLabel, hasCheckedInToday, fetchAllCheckIns } =
    useCheckInContext();
  const [expanded, setExpanded] = useState(false);
  const start = dayjs().startOf("day").toDate();
  const end = dayjs().endOf("day").toDate();

  const [latestCheckIn, setLatestCheckIn] = useState<null | {
    mood: keyof typeof moodEmoji;
    energy: keyof typeof energyEmoji;
    sleep: keyof typeof sleepEmoji;
    date: string;
  }>(null);
  function getMoodValue(label: string): number {
    switch (label) {
      case "Feeling Great": return 0;
      case "Pretty Good": return 25;
      case "Hanging in There": return 50;
      case "Not My Best": return 75;
      case "Having a Tough Day": return 100;
      default: return 50;
    }
  }
  
  function sleepLabelToScore(label: string): number {
    const map: Record<string, number> = {
      "Really Struggled": 1,
      "Not the Best": 2,
      "Okay Sleep": 3,
      "Pretty Restful": 4,
      "Slept Like a Baby": 5,
    };
    return map[label] || 3;
  }
  
  function energyLabelToScore(label: string): number {
    const map: Record<string, number> = {
      "Running on Empty": 1,
      "A Little Tired": 2,
      "Doing Alright": 3,
      "Feeling Energized": 4,
      "Ready to Take on the Day": 5,
    };
    return map[label] || 3;
  }
  
  const router = useRouter();

  
  useEffect(() => {
    const fetchCheckIn = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const q = query(
        collection(db, "users", uid, "checkins"),
        orderBy("timestamp", "desc"),
        limit(5)
      );

      const snapshot = await getDocs(q);
      const today = dayjs().format("YYYY-MM-DD");

      for (const doc of snapshot.docs) {
        const data = doc.data();
        const docDate = dayjs(data.timestamp?.toDate()).format("YYYY-MM-DD");
        if (docDate === today) {
          setLatestCheckIn({
            mood: data.mood || "",
            energy: data.energy || "",
            sleep: data.sleep || "",
            date: dayjs(data.timestamp?.toDate()).format("YYYY-MM-DD"),
          });
          console.log("Latest Check-In:", data);
          return;
        }
      }

      setLatestCheckIn(null); // No check-in for today
    };

    fetchCheckIn();
  }, []);

  const moodInfo = moodLabel
    ? moodMap.find((m) => m.moods.includes(moodLabel))
    : undefined;

  const handleToggleExpand = () => {
    LayoutAnimation.easeInEaseOut();
    setExpanded(!expanded);
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={handleToggleExpand}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Today's Check-In</Text>
            <Text style={styles.dateText}>
              {latestCheckIn?.date || "No check-in yet!"}
            </Text>
            {latestCheckIn && (
              <Text style={styles.subtext}>
                Your personalized suggestion below
              </Text>
            )}
          </View>
          <Icon
            source={expanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#622f00"
          />
        </View>
      </TouchableOpacity>

      <Card.Content>
        {expanded && latestCheckIn && (
          <View>
            {/* Mood */}
            <Text style={styles.data}>
              Mood: {moodEmoji[latestCheckIn.mood] || "💭"} {latestCheckIn.mood}
            </Text>

            {/* Energy */}
            <Text style={styles.data}>
              Energy: {energyEmoji[latestCheckIn.energy] || "⚡"}{" "}
              {latestCheckIn.energy}
            </Text>

            {/* Sleep */}
            <Text style={styles.data}>
              Sleep: {sleepEmoji[latestCheckIn.sleep] || "💤"}{" "}
              {latestCheckIn.sleep}
            </Text>

            {/* Mood Suggestion */}
            {moodInfo && (
              <>
                <Text style={styles.suggestion}>
                  You indicated you're feeling{" "}
                  {moodFeelingMap[moodLabel ?? ""] || "okay"} today
                </Text>

                <Text style={styles.suggestion}>{moodInfo.suggestion}</Text>
                <Button
                  mode="contained"
                  onPress={() =>
                    router.push(
                      moodInfo.route as Parameters<typeof router.push>[0]
                    )
                  }
                  style={styles.actionButton}
                  labelStyle={{ fontSize: 14, color: "#3d1c03" }}
                >
                  {moodInfo.label}
                </Button>
              </>
            )}

            {/* Edit Check-In Button */}
            <Button
              onPress={() => router.push("/checkInScreen")}
              mode="contained-tonal"
              style={styles.entryButton}
              textColor="#622f00"
            >
              Edit Check-In
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    backgroundColor: "#f8edeb",
    borderRadius: 10,
    padding: 5,
    width: width * 0.9,
    alignContent: "center",
    margin: "auto",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#622f00",
    fontFamily: "PatrickHand-Regular",
  },
  dateText: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
    fontFamily: "Main-font",
  },
  subtext: {
    fontSize: 15,
    color: "#94618e",
    marginTop: 4,
    fontStyle: "italic",
    fontFamily: "Main-font",
  },
  data: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
    fontFamily: "Main-font",
  },
  suggestion: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: "PatrickHand-Regular",
    color: "#3d1c03",
  },
  actionButton: {
    backgroundColor: "#DBE7E4",
    alignSelf: "flex-start",
    marginTop: 10,
  },
  entryButton: {
    marginTop: 16,
    backgroundColor: "#fae1dd",
  },
});
