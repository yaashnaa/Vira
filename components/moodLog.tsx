import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, Image, LogBox, Dimensions } from "react-native";
import { RadialSlider } from "react-native-radial-slider";
import { Button } from "react-native-paper";
import { useMoodContext } from "../context/moodContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter, useFocusEffect } from "expo-router";
import { Header as HeaderRNE, Icon } from "@rneui/themed";

LogBox.ignoreLogs([
  "Support for defaultProps will be removed from function components",
]);

const moodImages = [
  require("../assets/images/mood/vhappy.png"),
  require("../assets/images/mood/happy.png"),
  require("../assets/images/mood/neutral.png"),
  require("../assets/images/mood/sad.png"),
  require("../assets/images/mood/vsad.png"),
];

const moodTexts = [
  "On top of the world!",
  "Feeling good.",
  "Just okay.",
  "Not my best day",
  "Feeling really low",
];

const moodSubText = [
  "Happy, energetic, and shining bright!",
  "Things are looking up, feeling light.",
  "Not great, not bad. Just in between.",
  "A little off, maybe tired or sad.",
  "Overwhelmed or down, need a break.",
];

export default function MoodLogger() {
  const { mood: storedMood, logMood, fetchTodaysMood } = useMoodContext();
  const [mood, setMood] = useState<number>(storedMood ?? 50);
  const router = useRouter();

  // Sync mood when context changes
  useEffect(() => {
    if (storedMood !== null) {
      setMood(storedMood);
    }
  }, [storedMood]);

  // Refresh mood when user focuses the screen
  useFocusEffect(
    useCallback(() => {
      fetchTodaysMood();
    }, [])
  );

  const handleSliderChange = (newValue: number) => {
    const discreteValue = Math.round(newValue / 25) * 25;
    setMood(discreteValue);
  };

  const handleLogMood = async () => {
    console.log("Logging mood:", mood);
    await logMood(mood);
    router.push("/dashboard");
  };

  const handleBackPress = () => {
    router.replace("/dashboard");
  };

  const index = Math.min(Math.floor(mood / 25), moodImages.length - 1);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>How are you feeling today?</Text> */}
      <View style={styles.sliderWrapper}>
        <RadialSlider
          value={mood}
          isHideValue={true}
          min={0}
          max={100}
          step={25}
          onChange={handleSliderChange}
          subTitle=""
          unit=""
          isHideTailText={true}
          lineSpace={0}
          valueStyle={{ color: "transparent" }}
          radius={120}
          linearGradient={[
            { offset: "0%", color: "#e2d2ed" },
            { offset: "100%", color: "#ffd2cb" },
          ]}
        />
        <View style={styles.centerOverlay}>
          <Image source={moodImages[index]} style={styles.centerImage} />
        </View>
      </View>
      <Text style={styles.moodText}>{moodTexts[index]}</Text>
      <Text style={styles.submoodText}>{moodSubText[index]}</Text>
      <Button
        mode="elevated"
        onPress={handleLogMood}
        buttonColor="#ebdaf6"
        textColor="black"
        style={{ marginTop: 20 }}
      >
        Log Mood
      </Button>
    </View>
  );
}
const height = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    height: height *0.5
    // justifyContent: "center",
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontFamily: "PatrickHand-Regular",
  },
  sliderWrapper: {
    position: "relative",
  },
  centerOverlay: {
    position: "absolute",
    pointerEvents: "none",
    top: 0,
    left: 0,
    transform: [{ translateX: 70 }, { translateY: 50 }],
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  centerImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  moodText: {
    fontSize: 20,
    marginTop: 5,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Main-font",
  },
  submoodText: {
    fontSize: 16,
    marginTop: 5,
    color: "#333",
    textAlign: "center",
    fontFamily: "Main-font",
  },
});
