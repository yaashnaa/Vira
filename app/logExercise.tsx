// LogExercise.tsx - Component to log exercise using natural language + mood scale
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import LottieView from "lottie-react-native";

import { Button, Card, RadioButton } from "react-native-paper";
import { auth } from "@/config/firebaseConfig";
import { saveExerciseLog } from "@/utils/saveExerciseLog";
import { useMoodContext } from "@/context/moodContext";
import * as ImagePicker from "expo-image-picker";
const moodOptions = [
  {
    label: "Low Energy",
    value: 100,
    image: require("../assets/images/exerciseMood/1.png"),
  },
  {
    label: "A Bit Drained",
    value: 75,
    image: require("../assets/images/exerciseMood/2.png"),
  },
  {
    label: "Balanced & Okay",
    value: 50,
    image: require("../assets/images/exerciseMood/3.png"),
  },
  {
    label: "Refreshed & Content",
    value: 25,
    image: require("../assets/images/exerciseMood/4.png"),
  },
  {
    label: "Energized & Uplifted",
    value: 0,
    image: require("../assets/images/exerciseMood/5.png"),
  },
];

export default function LogExercise() {
  const [exerciseText, setExerciseText] = useState("");
  const [moodAfter, setMoodAfter] = useState("Neutral");
  const [submitting, setSubmitting] = useState(false);
  const { userId } = useMoodContext();
  const selectedMood =
    moodOptions.find((m) => m.label === moodAfter)?.value ?? 50;
  const handleSubmit = async () => {
    if (!exerciseText.trim()) {
      Alert.alert("Oops!", "Please enter an exercise description.");
      return;
    }

    setSubmitting(true);
    try {
      await saveExerciseLog({
        userId: userId || auth.currentUser?.uid || "",
        description: exerciseText,
        moodAfter: selectedMood,
      });

      Alert.alert("Success", "Exercise and mood logged successfully!");
      setExerciseText("");  
      setMoodAfter("Neutral");
    } catch (err) {
      Alert.alert("Error", "Something went wrong while saving your log.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Title title="Log Movement" titleStyle={styles.title} />
      <Card.Content>
        <Text style={styles.label}>What kind of movement did you do?</Text>
        <TextInput
          placeholder="e.g. 30 minutes yoga, 15 minutes walking..."
          value={exerciseText}
          onChangeText={setExerciseText}
          style={styles.input}
          placeholderTextColor="#999"
          multiline
        />

   
        <View style={styles.section}>
          <Text style={styles.label}>How did you feel after moving?</Text>
          <View style={styles.ratingRow}>
            {moodOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setMoodAfter(option.label)}
                style={
                  moodAfter === option.label
                    ? styles.selectedMood
                    : styles.moodOption
                }
              >
                <Image source={option.image} style={styles.moodImage} />
              </TouchableOpacity>
            ))}
          </View>

          {moodAfter && (
            <View style={styles.selectedMoodBox}>
              <Text style={styles.selectedMoodText}>{moodAfter}</Text>
            </View>
          )}
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={submitting}
          style={styles.button}
        >
          {submitting ? "Saving..." : "Save Log"}
        </Button>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 10,
    backgroundColor: "#fff3f3",
  },
  selectedMoodBox: {
    // marginTop: 12,
    // backgroundColor: "#f3e9fc",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  selectedMoodText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5A3E9B",
    fontFamily: "Main-font",
    textAlign: "center",
  },
  
  title: {
    fontSize: 20,
    color: "#0e0327",
    fontFamily: "PatrickHand-Regular",
  },

  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  radioRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#f4cac4",
  },
  section: {
    marginBottom: 15,
  },
  moodLabel: {
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
    maxWidth: 70,
    color: "#333",
    fontFamily: "Main-font",
  },

  selectedMoodLabel: {
    color: "#5A3E9B",
    fontWeight: "600",
  },

  label: {
    fontWeight: "600",
    marginBottom: 8,
    fontFamily: "Main-font",
  },

  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moodOption: {
    padding: 8,
  },
  selectedMood: {
    padding: 8,
    borderWidth: 2,
    borderColor: "#A084DC",
    borderRadius: 8,
  },
  emoji: {
    fontSize: 28,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
  moodImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
});
