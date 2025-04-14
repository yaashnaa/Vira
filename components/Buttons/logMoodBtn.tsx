import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { Card, Divider, Button } from "react-native-paper";
import { useMoodContext } from "@/context/moodContext";
import { useRouter } from "expo-router";

interface LogMoodButtonProps {
  onPress: () => void;
  isLogged?: boolean;
}

const moodMap: {
  text: string;
  emoji: string;
  suggestion: string;
  route: "/fitness" | "/journal" | "/mindfullness";
  label: string;
}[] = [
  {
    text: "are feeling on top of the world!",
    emoji: "😄",
    suggestion: "Try a high-energy workout to celebrate your vibe",
    route: "/fitness",
    label: "Go to Fitness",
  },
  {
    text: "are feeling good.",
    emoji: "😊",
    suggestion: "🧘 Maintain that balance with a mindful stretch session",
    route: "/fitness",
    label: "Explore Movement",
  },
  {
    text: "feel just okay.",
    emoji: "😐",
    suggestion: "🚶 Take a short walk or do a light activity to reset",
    route: "/fitness",
    label: "Gentle Workout",
  },
  {
    text: "don’t feel that great.",
    emoji: "😕",
    suggestion: "🫶 Try journaling a few thoughts to release the tension",
    route: "/journal",
    label: "Open Journal",
  },
  {
    text: "are feeling really low.",
    emoji: "😢",
    suggestion: "🌿 Try a calming breathing exercise to ground yourself",
    route: "/mindfullness",
    label: "Start Breathing",
  },
];

const getMoodInfo = (value: number | null) => {
  if (value === null) return null;
  const index = Math.min(Math.floor(value / 25), 4);
  return moodMap[index];
};

const { width } = Dimensions.get("window");

export default function LogMoodButton({
  onPress,
  isLogged = false,
}: LogMoodButtonProps) {
  const { mood } = useMoodContext();
  const router = useRouter();
  const moodInfo = getMoodInfo(mood);

  if (isLogged && moodInfo) {
    return (
      <View style={styles.recommendationBox}>
        <Text style={styles.recommendationText}>
          You indicated you {moodInfo.text} 
        </Text>
        <Text style={styles.suggestion}>{moodInfo.suggestion}</Text>
        <Button
          mode="contained"
          onPress={() => router.push(moodInfo.route)}
          style={styles.actionButton}
          labelStyle={{ fontSize: 14, color: "#3d1c03" }}
        >
          {moodInfo.label}
        </Button>
      </View>
    );
  }

  return (
    <Card onPress={onPress} style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Text style={styles.heading}>
          Log your mood today for personalized suggestions ✨
        </Text>
        <Divider style={styles.divider} />
        <Image
          source={require("../../assets/images/mood/moodScale.png")}
          style={styles.image}
        />
        <View style={styles.footer}>
          <Text style={styles.text}>Tap to log your mood</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  recommendationBox: {
    width: width * 0.9,
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
    width: width * 0.9,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: "#ffffff",
    alignSelf: "center",
    marginVertical: 10,
  },
  cardDisabled: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  cardContent: {
    alignItems: "center",
  },
  heading: {
    fontFamily: "PatrickHand-Regular",
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  divider: {
    width: "80%",
    marginVertical: 8,
  },
  image: {
    width: 320,
    height: 90,
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
