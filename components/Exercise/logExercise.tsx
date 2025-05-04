import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Animated,
  TouchableOpacity, useWindowDimensions
} from "react-native";
import { useRouter } from "expo-router";
import { Button, Card } from "react-native-paper";
import LottieView from "lottie-react-native";
import Toast from "react-native-toast-message";

import { saveExerciseLog } from "@/utils/saveExerciseLog";
import { auth } from "@/config/firebaseConfig";
import Header from "@/components/header";

const moodOptions = [
  {
    label: "Low Energy",
    value: 100,
    image: require("../../assets/images/exerciseMood/1.png"),
  },
  {
    label: "A Bit Drained",
    value: 75,
    image: require("../../assets/images/exerciseMood/2.png"),
  },
  {
    label: "Balanced & Okay",
    value: 50,
    image: require("../../assets/images/exerciseMood/3.png"),
  },
  {
    label: "Refreshed & Content",
    value: 25,
    image: require("../../assets/images/exerciseMood/4.png"),
  },
  {
    label: "Energized & Uplifted",
    value: 0,
    image: require("../../assets/images/exerciseMood/5.png"),
  },
];

export default function LogExercise() {
  const router = useRouter();
  
  const [exerciseText, setExerciseText] = useState("");
  const [moodAfter, setMoodAfter] = useState("Balanced & Okay");
  const [submitting, setSubmitting] = useState(false);
  const [animation] = useState(new Animated.Value(1));

  const selectedMoodValue =
    moodOptions.find((m) => m.label === moodAfter)?.value ?? 50;

  const handleSubmit = async () => {
    if (!exerciseText.trim()) {
      Alert.alert("Oops!", "Please enter an exercise description.");
      return;
    }

    setSubmitting(true);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error("No authenticated user found");
      }

      await saveExerciseLog({
        userId,
        description: exerciseText,
        moodAfter: selectedMoodValue,
      });

      Toast.show({ type: "success", text1: "Exercise log saved! 👏🏻" });
      setExerciseText("");
      setMoodAfter("Balanced & Okay");
      router.replace("/fitness/(tabs)/explore");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: "Failed to save your exercise log",
      });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header title="Log a Movement" backPath="/fitness/(tabs)/explore" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <LottieView
              source={require("../../assets/animations/exercise.json")}
              autoPlay
              loop
              style={{ width: "100%", height: "30%" }}
            />

            <Card style={styles.card} mode="contained">
              <Card.Title
                title="🏋️ Log Your Movement"
                titleStyle={styles.title}
              />
              <Card.Content>
                <Text style={styles.label}>
                  What kind of movement did you do?
                </Text>
                <TextInput
                  placeholder="e.g. 30 minutes yoga, 15 minutes walking..."
                  value={exerciseText}
                  onChangeText={(text) => setExerciseText(text.slice(0, 300))}
                  style={styles.input}
                  placeholderTextColor="#999"
                  multiline
                />

                <View style={styles.section}>
                  <Text style={styles.label}>
                    How did you feel after moving?
                  </Text>
                  <View style={styles.ratingRow}>
                    {moodOptions.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setMoodAfter(option.label);
                          Animated.sequence([
                            Animated.timing(animation, {
                              toValue: 1.3,
                              duration: 150,
                              useNativeDriver: true,
                            }),
                            Animated.timing(animation, {
                              toValue: 1,
                              duration: 150,
                              useNativeDriver: true,
                            }),
                          ]).start();
                        }}
                        style={
                          moodAfter === option.label
                            ? styles.selectedMood
                            : styles.moodOption
                        }
                      >
                        <Animated.Image
                          source={option.image}
                          style={[
                            styles.moodImage,
                            moodAfter === option.label && {
                              transform: [{ scale: animation }],
                            },
                          ]}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>

                  {moodAfter && (
                    <View style={styles.selectedMoodBox}>
                      <Text style={styles.selectedMoodText}>{moodAfter}</Text>
                    </View>
                  )}
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    disabled={submitting}
                    style={styles.button}
                    textColor="#000"
                  >
                    {submitting ? "Saving..." : "Save Log"}
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </>
  );
}

// const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    // alignSelf: "center",
    paddingBottom: 40,

    backgroundColor: "#fff",
  },

  container: {
    // flex: 1,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  card: {
    // width: "90%",
    maxWidth: 800, // Prevents stretching too wide on iPads
    backgroundColor: "#ffffff",
    padding: 16,
    justifyContent: "center",
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
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
  label: {
    fontWeight: "600",
    marginBottom: 8,
    fontFamily: "Main-font",
  },
  section: {
    marginBottom: 15,
    width: "100%",
  },
  ratingRow: {
    flexDirection: "row",
    // flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
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
  moodImage: {
    width: 40,
    height: 50,
    borderRadius: 10,
  },
  selectedMoodBox: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 10,
  },
  selectedMoodText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5A3E9B",
    fontFamily: "Main-font",
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    width: "70%",
    alignSelf: "center",
    backgroundColor: "#FAE1DD",
  },
});
