import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { Card, Divider } from "react-native-paper";
import { useMoodContext } from "@/context/moodContext";

interface LogMoodButtonProps {
  onPress: () => void;
  isLogged?: boolean;
}
const moodMap = [
  { text: "are feeling on top of the world!", emoji: "😄" },
  { text: "are feeling good.", emoji: "😊" },
  { text: "feel just okay.", emoji: "😐" },
  { text: "dont't feel that great.", emoji: "😕" },
  { text: "are feeling really low.", emoji: "😢" },
];

const getMoodDisplay = (value: number | null): string => {
  if (value === null) return "";
  const index = Math.min(Math.floor(value / 25), 4);
  return `${moodMap[index].text} ${moodMap[index].emoji} `;
};
const { width } = Dimensions.get("window");

export default function LogMoodButton({
  onPress,
  isLogged = false,
}: LogMoodButtonProps) {
  const { mood } = useMoodContext();

  if (isLogged && mood !== null) {
    return (
      <View style={styles.recommendationBox}>
        <Text style={styles.recommendationText}>
          {`You indicated you ${getMoodDisplay(mood)} Here's something that might help:`}
        </Text>

        <Text style={styles.suggestion}>🌿 Try a short breathing exercise</Text>
      </View>
    );
  }

  return (
    <Card onPress={onPress} style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Text style={styles.heading}>How are you feeling today?</Text>
        <Divider style={styles.divider} />
        <Image
          source={require("../../assets/images/mood/moodScale.png")}
          style={styles.image}
        />
        <View style={styles.footer}>
          <Text style={styles.text}>Log your mood</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  recommendationBox: {
    width: width * 0.9,
    backgroundColor: "#F5F0FF",
    padding: 16,
    borderRadius: 16,
    alignSelf: "center",
    marginVertical: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#C3B1E1",
  },
  
  recommendationText: {
    fontSize: 15,
    fontFamily: "Main-font",
    marginBottom: 8,
    color: "#333",
  },
  
  suggestion: {
    fontSize: 21,
    fontFamily: "PatrickHand-Regular",
    color: "#6B46C1",
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
    fontFamily: "Main-font",
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
