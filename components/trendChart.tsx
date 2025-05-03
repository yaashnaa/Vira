import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Card } from "react-native-paper";
import { useCheckInContext } from "@/context/checkInContext"; // use this now
import dayjs from "dayjs";

const screenWidth = Dimensions.get("window").width;

export default function TrendChart({
  metric,
}: {
  metric: "mood" | "sleep" | "energy";
}) {
  const { fetchAllCheckIns } = useCheckInContext(); // <- updated context
  const [data, setData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const all = await fetchAllCheckIns();
      const sorted = all
        .filter((entry) => entry[metric] !== undefined)
        .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

        const values = sorted.map((e) => {
          if (metric === "mood") return e.mood;
          if (metric === "sleep") return e.sleep;
          if (metric === "energy") return e.energy;
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
            Start checking in regularly to see your trends and insights appear here!
          </Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <View style={{alignSelf: "center", marginTop: 16}}>
      <LineChart
        data={{
          labels,
          datasets: [{ data }],
        }}
        width={screenWidth - 40}
        height={220}
        style={{ alignSelf: "center", marginVertical: 8 }}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: () => "#865dff",
          labelColor: () => "#333",
          strokeWidth: 2,
          propsForDots: { r: "0" },
          propsForBackgroundLines: { stroke: "transparent" },
          formatYLabel: (y) => {
            if (metric === "mood") {
              const moodMap: Record<string, string> = {
                "0": "😄 Great",
                "25": "😊 Good",
                "50": "😐 Okay",
                "75": "😕 Low",
                "100": "😢 Rough",
              };
              return moodMap[Math.round(Number(y)).toString()] || "";
            }
            if (metric === "sleep" || metric === "energy") {
              return Math.round(Number(y)).toString();
            }
            return "";
          },
        }}
        bezier

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
  if (!data.length) return "No entries yet — check in to discover your patterns 🌱";

  const avg = data.reduce((a, b) => a + b, 0) / data.length;

  if (metric === "mood") {
    if (avg <= 10) return "You’ve had a really uplifting week 🌞!";
    if (avg <= 30) return "You're doing pretty well overall 😊.";
    if (avg <= 60) return "It's been a mixed week — be kind to yourself 😌.";
    if (avg <= 85) return "Looks like it's been emotionally heavy 😔.";
    return "It’s been tough 💭 — remember, you’re not alone.";
  }

  if (metric === "sleep") {
    return avg >= 4
      ? "You've been sleeping well 🌙 — amazing for your mood!"
      : "Your sleep has been a bit off 🛏️ — maybe time for extra rest?";
  }

  if (metric === "energy") {
    return avg >= 4
      ? "Your energy has been strong ⚡ — keep fueling it well!"
      : "Low energy lately? 💤 Maybe your body needs some gentle care.";
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
});
