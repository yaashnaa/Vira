import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { RadialSlider } from "react-native-radial-slider";
import { Button } from "react-native-paper";

// Array of mood images for discrete steps (0, 25, 50, 75, 100)
const moodImages = [
  require("../assets/images/mood/vhappy.png"), // For mood = 0–24 (e.g., very happy)
  require("../assets/images/mood/happy.png"), // For mood = 25–49 (e.g., happy)
  require("../assets/images/mood/neutral.png"), // For mood = 50–74 (e.g., neutral)
  require("../assets/images/mood/sad.png"), // For mood = 75–99 (e.g., sad)
  require("../assets/images/mood/vsad.png"), // For mood = 100 (e.g., very sad)
];
const moodTexts = [
  "On top of the world!",
  "Feeling good.",
  "Just okay.",
  "Not my best day”",
  "Feeling really low",
];
const moodSubText = [
  "Happy, energetic, and shining bright!",
  "Things are looking up, feeling light.",
  "Not great, not bad. Just in between.",
  "A little off, maybe tired or sad.",
  "Overwhelmed or down, need a break.",
];
export default function MoodSlider() {
  // Use a value between 0 and 100 (in increments of 25)
  const [mood, setMood] = useState(50);

  // Ensure that the slider value is always discrete.
  const handleSliderChange = (newValue: number) => {
    setMood(newValue);
  };

  // Calculate the index based on the mood value.
  const index = Math.min(Math.floor(mood / 25), moodImages.length - 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>
      <View style={styles.sliderWrapper}>
        <RadialSlider
          value={mood}
          isHideValue={true} // Hide the default numeric value
          min={0}
          max={100}
          step={25}
          onChange={handleSliderChange}
          subTitle=""
          unit=""
          lineSpace={0}
          valueStyle={{ color: "transparent" }}
          radius={150}
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
      <Button mode="elevated" buttonColor="#ebdaf6" textColor="black" style={{ marginTop: 20 }} onPress={() => console.log("Mood logged:", mood)}>
        Log Mood
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {

    flex: 1,
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    fontFamily: "Title-font-regular",
  },
  sliderWrapper: {
    position: "relative",
  },
  centerOverlay: {
    position: "absolute",
    pointerEvents: "none",
    top: 0,
    left: 0,
    transform: [{ translateX: 50 }, { translateY: 30 }], // Center the overlay
    width: 250, // Match the slider's size
    height: 250, // Match the slider's size
    justifyContent: "center",
    alignItems: "center",
  },
  centerImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  moodText: {
    fontSize: 24,
    marginTop: 20,
    fontWeight: "bold",

    textAlign: "center",
    fontFamily: "Main-font",
  },
  submoodText: {
    fontSize: 18,
    marginTop: 20,
    color: "#333",
    textAlign: "center",
    fontFamily: "Main-font",
  },
});
