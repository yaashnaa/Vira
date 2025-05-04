import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { Card, Divider, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
interface MoodSuggestionsCardProps {
  latestCheckIn: Record<string, any> | null;
}

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
    suggestion: "🧘 Maintain that balance with a mindful stretch session",
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

const { width } = Dimensions.get("window");

export default function MoodSuggestionsCard({
  latestCheckIn,
}: MoodSuggestionsCardProps) {
  const router = useRouter();

  const moodLabel = latestCheckIn?.mood;
  const moodInfo = moodMap.find((m) => m.moods.includes(moodLabel));

  if (latestCheckIn && moodInfo) {
    return (
      <View style={styles.recommendationBox}>
        <Text style={styles.recommendationText}>
          You said you're {moodLabel.toLowerCase()} today {moodInfo.emoji}
        </Text>
        <Text style={styles.suggestion}>{moodInfo.suggestion}</Text>
        <Button
          mode="contained"
          onPress={() =>
            router.push(moodInfo.route as Parameters<typeof router.push>[0])
          }
          style={styles.actionButton}
          labelStyle={{ fontSize: 14, color: "#3d1c03" }}
        >
          {moodInfo.label}
        </Button>
      </View>
    );
  }

  return (
    <Card onPress={() => router.push("/checkInScreen")} style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={{width: "100%", alignItems: "center" }}>
          <LottieView
            source={require("../../assets/animations/checkin.json")}
            autoPlay
            loop
            style={styles.image}
          />
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={styles.heading}>
              Check in to get personalized suggestions✨
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.footer}>
          <Text style={styles.text}>Tap to check in</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  recommendationBox: {
    width: width * 0.8,
    backgroundColor: "#f8edeb",
    padding: 16,
    borderRadius: 16,
    alignSelf: "center",
    marginVertical: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#fae1dd",
  },
  recommendationText: {
    fontSize: 17,
    fontFamily: "Main-font",
    marginBottom: 8,
    color: "#333",
  },
  suggestion: {
    fontSize: 21,
    fontFamily: "PatrickHand-Regular",
    color: "#3d1c03",
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: "#DBE7E4",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  card: {
    width: "90%",
    borderRadius: 16,
    elevation: 4,
    backgroundColor: "#ffffff",
    alignSelf: "center",
    marginVertical: 10,
  },
  cardContent: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontFamily: "PatrickHand-Regular",
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    width: "80%",
    flexWrap: "wrap",
  },
  divider: {
    width: "80%",
    marginVertical: 8,
  },
  image: {
    width: 320,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  footer: {
    width: "100%",
    backgroundColor: "rgba(195,177,225, 0.3)",
    paddingVertical: 8,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    fontFamily: "Main-font",
    textAlign: "center",
  },
});
