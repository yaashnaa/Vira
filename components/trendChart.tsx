import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Card } from "react-native-paper";
import { useMoodContext } from "@/context/moodContext";
import dayjs from "dayjs";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function TrendChart({
  metric,
}: {
  metric: "mood" | "sleep" | "energy";
}) {
  const { fetchAllCheckIns } = useMoodContext(); // Add this method to context if not yet there
  const [data, setData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const all = await fetchAllCheckIns(); // Fetches last 7 days ideally
      const sorted = all
        .filter((entry) => entry[metric] !== undefined)
        .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
      function getMoodValue(label: string): number {
        const map: Record<string, number> = {
          "Feeling Great": 5,
          "Pretty Good": 4,
          "Hanging in There": 3,
          "Not My Best": 2,
          "Having a Tough Day": 1,
        };
        return map[label] || 0; // fallback to 0
      }

      const values = sorted.map((e) => {
        if (metric === "mood")
          return isNaN(Number(e.mood)) ? 0 : Number(e.mood);

        if (metric === "sleep") return sleepLabelToScore(e.sleep);
        if (metric === "energy") return energyLabelToScore(e.energy);
        return 0;
      });

      const xLabels = sorted.map((e) => dayjs(e.date).format("DD/MM"));

      setData(values);
      setLabels(xLabels);
    };

    fetchData();
  }, [metric]);
  if (!data.length) {
    return (
      <Card style={styles.fallbackCard}>
        <Card.Content>
          <Text style={styles.fallbackText}>📊 Not enough data yet</Text>
          <Text style={styles.fallbackSubtext}>
            Start checking in regularly to see your trends and insights appear
            here!
          </Text>
        </Card.Content>
      </Card>
    );
  }
  return (
    <View>
      <LineChart
        data={{
          labels,
          datasets: [{ data }],
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: () => "#865dff",
          labelColor: () => "#333",
          strokeWidth: 2,
          propsForDots: { r: "0" },
          propsForBackgroundLines: { stroke: "transparent" },
          formatYLabel: (y) => {
            const moodMap: Record<string, string> = {
              "0": "😄 Great",
              "25": "😊 Good",
              "50": "😐 Okay",
              "75": "😕 Low",
              "100": "😢 Rough",
            };
            return moodMap[y] || "";
          },
        }}
        bezier
        style={{ borderRadius: 16 }}
      />

      <Text style={styles.insight}>{generateInsight(metric, data)}</Text>
    </View>
  );
}

function sleepLabelToScore(label: string) {
  const map: Record<string, number> = {
    "Really Struggled": 1,
    "Not the Best": 2,
    "Okay Sleep": 3,
    "Pretty Restful": 4,
    "Slept Like a Baby": 5,
  };
  return map[label] || 0;
}

function energyLabelToScore(label: string) {
  const map: Record<string, number> = {
    "Running on Empty": 1,
    "A Little Tired": 2,
    "Doing Alright": 3,
    "Feeling Energized": 4,
    "Ready to Take on the Day": 5,
  };
  return map[label] || 0;
}

function generateInsight(metric: string, data: number[]) {
  if (!data.length)
    return "No entries yet — try checking in to discover your patterns 🌱";

  const avg = data.reduce((a, b) => a + b, 0) / data.length;

  if (metric === "mood") {
    if (avg <= 10) {
      return "You’ve had a really uplifting week 🌞 — whatever you’re doing, it’s clearly fueling you!";
    } else if (avg <= 30) {
      return "You seem to be doing pretty well overall 😊. Even if there were some dips, the trend is hopeful.";
    } else if (avg <= 60) {
      return "It’s been a mixed week 😐. Some good days, some tough ones — be kind to yourself through it all.";
    } else if (avg <= 85) {
      return "Looks like it’s been an emotionally heavy week 😔. Make space for rest and small joys.";
    } else {
      return "It’s been tough 💭. If you're feeling overwhelmed, remember support is always valid — you're not alone.";
    }
  }

  if (metric === "sleep") {
    return avg >= 4
      ? "You’ve been sleeping pretty well 🌙 — great for your brain and mood!"
      : "Your sleep’s been all over the place 🛏️ — maybe time to tweak your routine?";
  }

  if (metric === "energy") {
    return avg >= 4
      ? "You've had some strong energy this week ⚡ — love that momentum!"
      : "Feeling low on energy? 💤 Your body might be asking for a pause, and that’s okay.";
  }

  return "";
}

const styles = StyleSheet.create({
  insight: {
    marginTop: 12,
    textAlign: "center",
    fontFamily: "Main-font",
    fontSize: 16,
    color: "#3e2a6e",
  },
  fallbackCard: {
    backgroundColor: "#fff0f6",
    borderRadius: 12,
    margin: 16,
    padding: 20,
  },
  fallbackText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8a1c58",
    marginBottom: 6,
    fontFamily: "Main-font",
  },
  fallbackSubtext: {
    fontSize: 14,
    color: "#4a4a4a",
    fontFamily: "Main-font",
  },
  chartCard: {
    backgroundColor: "#f0f8ff",
    borderRadius: 12,
    margin: 16,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: "PatrickHand-Regular",
    color: "#2a2a2a",
  },
});
