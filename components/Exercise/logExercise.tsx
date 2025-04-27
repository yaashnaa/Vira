import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { Header as HeaderRNE, Icon } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Card, RadioButton } from "react-native-paper";
import { auth } from "@/config/firebaseConfig";
import { saveExerciseLog } from "@/utils/saveExerciseLog";
import { useMoodContext } from "@/context/moodContext";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import LottieView from "lottie-react-native";
import { Animated } from "react-native";
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
  const [exerciseText, setExerciseText] = useState("");
  const [moodAfter, setMoodAfter] = useState("Balanced & Okay"); // ✅ Default matches moodOptions
  const [submitting, setSubmitting] = useState(false);
  const { userId } = useMoodContext();
  const [animation] = useState(new Animated.Value(1));

  const router = useRouter();

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

      Toast.show({
        type: "success",
        text1: "Exercise log saved!👏🏻",
      });

      setExerciseText("");
      setMoodAfter("Balanced & Okay"); // ✅ Reset to default after save
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
      <Header title="" backPath="/fitness/(tabs)/explore" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <LottieView
            source={require("../../assets/animations/exercise.json")}
            autoPlay
            loop
            style={{ width: "100%", height: 200 }}
          />
          <Card style={styles.card} mode="contained">
            <Card.Title title="🏋️ Log Your Movement" titleStyle={styles.title} />
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
                <Text style={styles.label}>How did you feel after moving?</Text>
                <View style={styles.ratingRow}>
                  {moodOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      accessibilityLabel={`Select mood: ${option.label}`}
                      onPress={() => {
                        setMoodAfter(option.label);
                        Animated.sequence([
                          Animated.timing(animation, {
                            toValue: 1.3,
                            duration: 150,
                            useNativeDriver: true,
                          }),
                          Animated.timing(animation, {
                            toValue: 1, // Back to normal
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
                      <Image source={option.image} style={styles.moodImage} />
                      {/* <Animated.View
                        style={{
                          transform: [
                            {
                              scale: moodAfter === option.label ? animation : 1,
                            },
                          ],
                        }}
                      >
                        <Image source={option.image} style={styles.moodImage} />
                      </Animated.View> */}
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
                textColor="#000"
              >
                {submitting ? "Saving..." : "Save Log"}
              </Button>
              <Button
                mode="contained"
                onPress={() => router.replace("/fitness/(tabs)/explore")}
                textColor="#000"
                style={[styles.button, { width: "40%", margin: "auto" }]}
              >
                Back
              </Button>
            </Card.Content>
          </Card>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#ffffff",
    height: height * 0.9,
    width: width,

    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  card: {
    // margin: 16,
    padding: 10,
    backgroundColor: "#ffffff",
    // height: height * 0.5,
    width: width ,
    justifyContent: "center",
    alignItems: "center",
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
  headerRight: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
  },
  selectedMoodText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5A3E9B",
    fontFamily: "Main-font",
    textAlign: "center",
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
  radioRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  button: {
    marginTop: 20,
    width: "80%",
    alignSelf: "center",
    backgroundColor: "#FAE1DD",
  },
  section: {
    marginBottom: 15,
    width: "100%",
  },
  moodLabel: {
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
    // maxWidth: 70,
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
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12, 
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
    width: width,
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
  moodImage: {
    width: 40,
    height: 50,
    borderRadius: 10,
  },
});
