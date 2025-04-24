// app/quiz/QuizScreen.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { doc, setDoc } from "firebase/firestore";
import { isScreeningQuizCompleted } from "@/utils/firestore";
import { db } from "@/config/firebaseConfig";
import { auth } from "@/config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  isScreeningQuizComplete,
  markQuizComplete,
} from "@/utils/asyncStorage";
import { Button, ProgressBar } from "react-native-paper";
import { useUserPreferences } from "../../context/userPreferences";
import { useRouter } from "expo-router";
import BasicQuiz from "./basic";
import { lightTheme } from "@/config/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
export default function QuizScreen() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [dietPreferences, setDietPreferences] = useState<string[]>([]);
  const [customDiet, setCustomDiet] = useState("");
  const [mealLoggingComfort, setMealLoggingComfort] = useState<string>("");
  const [physicalHealth, setPhysicalHealth] = useState<string>("");
  const [calorieViewing, setCalorieViewing] = useState<string>("");
  const [macroViewing, setMacroViewing] = useState<string>("");
  const [remindersFrequency, setRemindersFrequency] = useState("Standard");
  const [moodCheckIn, setMoodCheckIn] = useState("");
  const [mentalHealthResouces, setMentalHealthResouces] = useState(""); // string
  const [customMedicalConditions, setCustomMedicalConditions] = useState("");
  const [customDisorder, setCustomDisorder] = useState("");

  const [approach, setApproach] = useState("");
  const [caloriePreference, setCaloriePreference] = useState("");
  const [macroPreference, setMacroPreference] = useState("");
  const [foodAnxietyLevel, setFoodAnxietyLevel] = useState("");
  const [movementRelationship, setMovementRelationship] = useState("");
  const [tonePreference, setTonePreference] = useState("");
  const [contentAvoidance, setContentAvoidance] = useState("");
  const [copingConsent, setCopingConsent] = useState("");
  const [userNotes, setUserNotes] = useState("");

  const { updatePreferences } = useUserPreferences();
  const [dataConsent, setDataConsent] = useState(false);
  const [showResourceConsent, setShowResourceConsent] = useState<
    boolean | null
  >(null); // null means not answered

  // Handlers for disclaimer consent:
  const handleConsentAgree = () => setDataConsent(true);
  const handleConsentCancel = () => setDataConsent(false);

  const handleResourceYes = () => setShowResourceConsent(true);
  const handleResourceNo = () => setShowResourceConsent(false);
  const handleFinalSubmit = async () => {
    const calorieViewingBool =
      caloriePreference === "Yes, I’d like to see calories.";
    const macroViewingBool = macroPreference === "Yes, I’d like to see macros.";

    const moodCheckInBool = moodCheckIn !== "No, I’d rather keep it simple.";

    const finalDietaryPreferences = [...dietPreferences];
    const finalCustomDietaryPreferences: string[] = customDiet.trim()
      ? [customDiet.trim()]
      : [];

    const hideMealTrackingBool = [
      "I’m not comfortable logging meals.",
      "I’d prefer to log only general descriptions of meals.",
    ].includes(mealLoggingComfort);

    const anxiousFoodBool = [
      "Yes, I often feel anxious",
      "Sometimes, but it's manageable",
    ].includes(foodAnxietyLevel);

    const mentalHealthResourcesBool =
      mentalHealthResouces === "Yes, please show me available resources." ||
      mentalHealthResouces === "Not sure, remind me later.";

    const updated = {
      dietaryPreferences: finalDietaryPreferences ?? [],
      physicalHealth: physicalHealth || "Prefer not to say",
      customDietaryPreferences: finalCustomDietaryPreferences ?? [],
      mealLogging: mealLoggingComfort || "Not sure yet",
      hideMealTracking: hideMealTrackingBool ?? false,
      calorieViewing: calorieViewingBool ?? true,
      macroViewing: macroViewingBool ?? true,
      caloriePreference:
        caloriePreference || "No, I’d prefer not to see calories.",
      macroPreference: macroPreference || "No, I’d prefer not to see macros.",
      customMedicalConditions: customMedicalConditions || "",
      customMentalHealthConditions: customDisorder || "",
      foodAnxietyLevel: foodAnxietyLevel || "Prefer not to say",
      anxiousFood: foodAnxietyLevel || "Prefer not to say",
      mentalHealthSupport: mentalHealthResouces || "Not sure, remind me later.",
      remindersFrequency: remindersFrequency || "Standard",
      moodCheckIn: moodCheckIn || "No, I’d rather keep it simple.",
      moodcCheckInBool: ["Yes, definitely.", "Maybe, but not sure."].includes(
        moodCheckIn
      ),
      approach:
        approach || "Adaptive – Let the app adjust to my mood logs and habits.",
        movementRelationship: movementRelationship ?? "",
        tonePreference: tonePreference ?? "",
        contentAvoidance: contentAvoidance ?? "",
        copingToolsConsent: copingConsent ?? "",
        userNotes: userNotes ?? "",
    };

    const currentUser = auth.currentUser;
    updatePreferences(updated);
    if (currentUser) {
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          screeningQuizCompleted: true,
        },
        { merge: true }
      );

      // console.log("✅ Quiz complete for:", currentUser.uid);
    } else {
      console.error("No current user found.");
    }
    console.log("User Preferences Submitted!");
    router.replace("/dashboard");
  };

  const totalSteps = 4; // Total number of steps in the quiz
  const progress = (step + 1) / totalSteps; // Calculate progress percentage
  const handleNext = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    setStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // A helper for toggling multi-select options.
  const toggleDietPreference = (preference: string) => {
    setDietPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((p) => p !== preference)
        : [...prev, preference]
    );
  };

  const handleFirstBack = () => {
    router.push("/dashboard");
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <SafeAreaView style={styles.section}>
              <View style={{ marginBottom: 20 }}>
                <ProgressBar
                  progress={(step + 1) / totalSteps}
                  color="#A084DC"
                  style={{ height: 10, borderRadius: 5 }}
                />
                <Text
                  style={{ textAlign: "center", fontSize: 16, marginTop: 5 }}
                >
                  Step {step + 1} of {totalSteps}
                </Text>
              </View>
              <SafeAreaView style={styles.section}>
                <Text style={styles.sectionTitle}>
                  1. Dietary Preferences/Restrictions
                </Text>
                <Text style={styles.question}>
                  Do you have any dietary preferences or restrictions? (Select
                  all that apply)
                </Text>
                <View style={styles.optionContainer}>
                  {[
                    "None",
                    "Vegetarian",
                    "Vegan",
                    "Gluten-free",
                    "Dairy-free",
                    "Other",
                  ].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        dietPreferences.includes(option) &&
                          styles.selectedOption,
                      ]}
                      onPress={() => toggleDietPreference(option)}
                    >
                      <Text>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {dietPreferences.includes("Other") && (
                  <TextInput
                    style={styles.input}
                    placeholder="Please specify"
                    value={customDiet}
                    onChangeText={setCustomDiet}
                  />
                )}

                <Text style={styles.question}>
                  Are you comfortable logging the types of meals you eat?
                </Text>
                <View style={styles.optionContainer}>
                  {[
                    "Yes, I’m okay with logging.",
                    "I’d prefer to log only general descriptions of meals.",
                    "I’m not comfortable logging meals.",
                    "Not sure yet.",
                  ].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        mealLoggingComfort === option && styles.selectedOption,
                      ]}
                      onPress={() => setMealLoggingComfort(option)}
                    >
                      <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.question}>
                  Would you like to see calorie information?
                </Text>
                <View style={styles.optionContainer}>
                  {[
                    "Yes, I’d like to see calories.",
                    "No, I’d prefer not to see calories.",
                  ].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        caloriePreference === option && styles.selectedOption,
                      ]}
                      onPress={() => setCaloriePreference(option)}
                    >
                      <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.question}>
                  Would you like to see macro (protein/fat/carb) information?
                </Text>
                <View style={styles.optionContainer}>
                  {[
                    "Yes, I’d like to see macros.",
                    "No, I’d prefer not to see macros.",
                  ].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        macroPreference === option && styles.selectedOption,
                      ]}
                      onPress={() => setMacroPreference(option)}
                    >
                      <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.navigationButtons}>
                  <Button
                    mode="contained"
                    textColor="#390a84"
                    theme={{ colors: { primary: "#C3B1E1" } }}
                    onPress={handleFirstBack}
                    style={{ marginTop: 20 }}
                  >
                    Back
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleNext}
                    textColor="#390a84"
                    theme={{ colors: { primary: "#C3B1E1" } }}
                    style={{ marginTop: 20 }}
                  >
                    Next
                  </Button>
                </View>
              </SafeAreaView>
            </SafeAreaView>
          </>
        );
      case 1:
        return (
          <>
            <SafeAreaView style={styles.section}>
              <View style={{ marginBottom: 20 }}>
                <ProgressBar
                  progress={(step + 1) / totalSteps}
                  color="#A084DC"
                  style={{ height: 10, borderRadius: 5 }}
                />
                <Text
                  style={{ textAlign: "center", fontSize: 16, marginTop: 5 }}
                >
                  Step {step + 1} of {totalSteps}
                </Text>
              </View>
              <SafeAreaView style={styles.section}>
                <Text style={styles.sectionTitle}>
                  2.1 Physical & Mental Health Background
                </Text>
                <View>
                  <Text style={styles.question}>
                    How would you rate your current physical health?
                  </Text>
                  <View style={styles.optionContainer}>
                    {[
                      "Very poor",
                      "Poor",
                      "Average",
                      "Good",
                      "Excellent",
                      "Prefer not to say",
                    ].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          physicalHealth === option && styles.selectedOption,
                        ]}
                        onPress={() => setPhysicalHealth(option)}
                      >
                        <Text>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <Text style={styles.sectionTitle}>
                  2.2 Mental Health & Emotional State (Opt-In)
                </Text>

                <View>
                  <Text style={styles.question}>
                    Do you ever feel anxious around mealtimes or tracking your
                    food/exercise?
                  </Text>
                  <View style={styles.optionContainer}>
                    {[
                      "Yes, I often feel anxious",
                      "Sometimes, but it's manageable",
                      "Rarely, but it's there",
                      "No, I don't feel anxious",
                      "Prefer not to say",
                    ].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          foodAnxietyLevel === option && styles.selectedOption,
                        ]}
                        onPress={() => setFoodAnxietyLevel(option)}
                      >
                        <Text>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.navigationButtons}>
                  <Button
                    onPress={handleBack}
                    mode="contained"
                    style={{ marginTop: 20 }}
                    textColor="#390a84"
                    theme={{ colors: { primary: "#C3B1E1" } }}
                  >
                    Back
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleNext}
                    style={{ marginTop: 20 }}
                    textColor="#390a84"
                    theme={{ colors: { primary: "#C3B1E1" } }}
                  >
                    Next
                  </Button>
                </View>
              </SafeAreaView>
            </SafeAreaView>
          </>
        );

      case 2:
        return (
          <>
            <View style={{ marginBottom: 20 }}>
              <ProgressBar
                progress={(step + 1) / totalSteps}
                color="#A084DC"
                style={{ height: 10, borderRadius: 5 }}
              />
              <Text style={{ textAlign: "center", fontSize: 16, marginTop: 5 }}>
                Step {step + 1} of {totalSteps}
              </Text>
            </View>
            <SafeAreaView style={styles.container}>
              <Text style={styles.sectionTitle}>3.0 App Preferences</Text>

              <View>
                <Text style={styles.question}>
                  How often would you like reminders or nudges?
                </Text>
                <View style={styles.optionContainer}>
                  {[
                    "None (I’ll check in manually)",
                    "Minimal (once per day)",
                    "Standard (2–3 times per day)",
                    "Frequent (several times per day)",
                    "Not sure, will adjust later",
                  ].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        remindersFrequency === option && styles.selectedOption,
                      ]}
                      onPress={() => setRemindersFrequency(option)}
                    >
                      <Text>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View>
                <Text style={styles.question}>
                  Would you prefer a manual or adaptive approach to setting
                  goals?
                </Text>
                <View style={styles.optionContainer}>
                  {[
                    " Manual – I want to set my own goals (like daily steps, weekly workout targets, etc.).",
                    "Adaptive – Let the app adjust to my mood logs and habits.",
                    "A mix of both (I’ll handle some metrics, but I want the app to suggest changes based on my mood).",
                  ].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        approach.includes(option) && styles.selectedOption,
                      ]}
                      onPress={() => setApproach(option)}
                    >
                      <Text>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View>
                <Text style={styles.question}>
                  Are you interested in a regular mood check-in to adapt recipes
                  and fitness suggestions?
                </Text>
                <View style={styles.optionContainer}>
                  {[
                    "Yes, definitely.",
                    "Maybe, but not sure.",
                    "No, I’d rather keep it simple.",
                  ].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        moodCheckIn.includes(option) && styles.selectedOption,
                      ]}
                      onPress={() => setMoodCheckIn(option)}
                    >
                      <Text>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View>
                <Text style={styles.question}>
                  Do you want access to mental health resources (hotlines,
                  articles, etc.) in the app?
                </Text>
                <View style={styles.optionContainer}>
                  {[
                    "Yes, please show me available resources.",
                    "Not right now.",
                    "Not sure, remind me later.",
                  ].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        mentalHealthResouces.includes(option) &&
                          styles.selectedOption,
                      ]}
                      onPress={() => setMentalHealthResouces(option)}
                    >
                      <Text>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.navigationButtons}>
                <Button
                  onPress={handleBack}
                  mode="contained"
                  textColor="#390a84"
                  style={{ marginTop: 20 }}
                  theme={{ colors: { primary: "#C3B1E1" } }}
                >
                  Back
                </Button>
                <Button
                  onPress={handleNext}
                  mode="contained"
                  textColor="#390a84"
                  style={{ marginTop: 20 }}
                  theme={{ colors: { primary: "#C3B1E1" } }}
                >
                  Next
                </Button>
              </View>
            </SafeAreaView>
          </>
        );
        case 3:
          return (
            <SafeAreaView style={styles.section}>
              <View style={{ marginBottom: 20 }}>
                <ProgressBar
                  progress={(step + 1) / totalSteps}
                  color="#A084DC"
                  style={{ height: 10, borderRadius: 5 }}
                />
                <Text style={{ textAlign: "center", fontSize: 16, marginTop: 5 }}>
                  Step {step + 1} of {totalSteps}
                </Text>
              </View>
          
              <Text style={styles.sectionTitle}>3. Personal Preferences</Text>
          
              <Text style={styles.question}>How would you describe your current relationship with movement/exercise?</Text>
              <View style={styles.optionContainer}>
                {[
                  "Love it, I look forward to it",
                  "Neutral, depends on the day",
                  "Struggling or inconsistent",
                  "Avoid it or feel negative about it",
                  "Prefer not to say"
                ].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      movementRelationship === option && styles.selectedOption,
                    ]}
                    onPress={() => setMovementRelationship(option)}
                  >
                    <Text>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
          
              <Text style={styles.question}>What tone motivates you best?</Text>
              <View style={styles.optionContainer}>
                {[
                  "Gentle & encouraging",
                  "Direct & motivational",
                  "Neutral",
                  "Let me choose per situation"
                ].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      tonePreference === option && styles.selectedOption,
                    ]}
                    onPress={() => setTonePreference(option)}
                  >
                    <Text>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
          
              <Text style={styles.question}>Are there any topics you’d like us to avoid showing in content (like workouts, food, body image)?</Text>
              <View style={styles.optionContainer}>
                {[
                  "No, I’m okay seeing everything",
                  "Avoid body image content",
                  "Avoid diet/food content",
                  "Avoid weight loss content",
                  "Avoid all fitness content",
                  "Not sure, let me adjust later"
                ].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      contentAvoidance === option && styles.selectedOption,
                    ]}
                    onPress={() => setContentAvoidance(option)}
                  >
                    <Text>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
          
              <Text style={styles.question}>Would you like to see gentle coping tools (like breathing exercises, journal prompts) during check-ins?</Text>
              <View style={styles.optionContainer}>
                {[
                  "Yes, I’d love that",
                  "Maybe, let me decide later",
                  "No, I’d prefer not to see them"
                ].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      copingConsent === option && styles.selectedOption,
                    ]}
                    onPress={() => setCopingConsent(option)}
                  >
                    <Text>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
          
              <View style={styles.navigationButtons}>
                <Button
                  onPress={handleBack}
                  mode="contained"
                  style={{ marginTop: 20 }}
                  textColor="#390a84"
                  theme={{ colors: { primary: "#C3B1E1" } }}
                >
                  Back
                </Button>
                <Button
                  mode="contained"
                  onPress={handleNext}
                  style={{ marginTop: 20 }}
                  textColor="#390a84"
                  theme={{ colors: { primary: "#C3B1E1" } }}
                >
                  Next
                </Button>
              </View>
            </SafeAreaView>
          );
          
      // Continue with further steps for Personal Goals & App Preferences and Disclaimers & Consent.
      default:
        return (
          <>
            <View style={{ marginBottom: 20 }}>
              <ProgressBar
                progress={(step + 1) / totalSteps}
                color="#A084DC"
                style={{ height: 10, borderRadius: 5 }}
              />
              <Text style={{ textAlign: "center", fontSize: 16, marginTop: 5 }}>
                Step {step + 1} of {totalSteps}
              </Text>
            </View>
            <SafeAreaView style={styles.section}>
              <Text style={styles.sectionTitle}>Review & Submit</Text>
              <Text>Review your responses and submit your quiz.</Text>

              <View style={styles.disclaimerContainer}>
                <Text style={styles.disclaimerText}>
                  Data Use: “By continuing, you agree that the app can store
                  your responses to personalize your experience. You can delete
                  or export your data at any time in Settings.”
                </Text>
                <View style={styles.consentButtons}>
                  <TouchableOpacity
                    style={[
                      styles.consentButton,
                      dataConsent && styles.selectedConsentButton,
                    ]}
                    onPress={handleConsentAgree}
                  >
                    <Text style={styles.buttonText}>
                      I understand and agree
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.consentButton,
                      dataConsent === false && styles.selectedConsentButton,
                    ]}
                    onPress={handleConsentCancel}
                  >
                    <Text style={styles.buttonText}>Cancel/Exit</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.disclaimerContainer}>
                <Text style={styles.disclaimerText}>
                  Disclaimer: “This app does not replace professional medical or
                  mental health advice. If you are experiencing severe distress
                  or suspect a serious mental health issue, please seek
                  professional help. Would you like to see a list of mental
                  health resources?”
                </Text>
                <View style={styles.consentButtons}>
                  <TouchableOpacity
                    style={[
                      styles.consentButton,
                      showResourceConsent === true &&
                        styles.selectedConsentButton,
                    ]}
                    onPress={handleResourceYes}
                  >
                    <Text style={styles.buttonText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.consentButton,
                      showResourceConsent === false &&
                        styles.selectedConsentButton,
                    ]}
                    onPress={handleResourceNo}
                  >
                    <Text style={styles.buttonText}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.navigationButtons}>
                <Button
                  mode="contained"
                  textColor="#390a84"
                  icon={"arrow-left"}
                  theme={{ colors: { primary: "#C3B1E1" } }}
                  onPress={handleBack}
                >
                  Back
                </Button>

                <Button
                  mode="contained"
                  textColor="#1f0746"
                  style={{
                    width: "35%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  icon="check"
                  theme={{ colors: { primary: "#C3B1E1" } }}
                  onPress={() => {
                    // Only submit if data consent is given; otherwise, do nothing or exit.
                    if (dataConsent) {
                      handleFinalSubmit();
                    } else {
                      alert(
                        "You must agree to the data use policy to continue."
                      );
                    }
                  }}
                >
                  Submit
                </Button>
              </View>
            </SafeAreaView>
          </>
        );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} ref={scrollViewRef}>
      {renderStep()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  section: {
    fontFamily: "Main-font",
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 0,
    fontFamily: "PatrickHand-Regular",
    marginTop: 30,
  },
  question: {
    fontSize: 18,
    marginVertical: 10,
    marginBottom: 10,
    marginTop: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e8dcdc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  optionContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  optionButton: {
    backgroundColor: "#eae9ee",
    fontFamily: "Serif-font",
    padding: 15,
    margin: 5,
    borderWidth: 0,
    borderRadius: 35,
    width: "100%",
    textAlign: "left",
    justifyContent: "center",
  },
  selectedOption: {
    color: "#390a84",
    borderColor: "#390a84",
    borderWidth: 0,
    backgroundColor: "#C3B1E1",
  },
  optionText: {
    fontSize: 15,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  disclaimerContainer: {
    marginVertical: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  disclaimerText: {
    fontSize: 14,
    marginBottom: 10,
    color: "#555",
  },
  consentButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  consentButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  selectedConsentButton: {
    color: "#390a84",
    backgroundColor: "#C3B1E1",
  },
  buttonText: {
    color: "#372553",
    fontWeight: "600",
  },
});
