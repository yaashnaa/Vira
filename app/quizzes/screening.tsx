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
import { Button, ProgressBar } from "react-native-paper";
import { useUserPreferences } from "../../context/userPreferences";
import { useRouter } from "expo-router";
import BasicQuiz from "./basic";
import { lightTheme } from "@/config/theme";

export default function QuizScreen() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  // Example state variables for a few questions.
  const [dietPreferences, setDietPreferences] = useState<string[]>([]);
  const [customDiet, setCustomDiet] = useState("");
  const [mealLoggingComfort, setMealLoggingComfort] = useState("");
  const [physicalHealth, setPhysicalHealth] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [mentalDisorder, setMentalDisorder] = useState("");
  const [calorieViewing, setCalorieViewing] = useState("");
  const [remindersFrequency, setRemindersFrequency] = useState("Standard");
  const [hideMealTracking, setHideMealTracking] = useState(false);
  const [anxiousFood, setAnxiousFood] = useState("");
  const [primaryGoals, setPrimaryGoals] = useState<string[]>([]);
  const [moodCheckIn, setMoodCheckIn] = useState("");
  const [mentalHealthResouces, setmentalHealthResouces] = useState("");
  const [customMedicalConditions, setCustomMedicalConditions] = useState("");
  const [customDisorder, setCustomDisorder] = useState("");
  const [hideTriggers, setHideTriggers] = useState("");
  const [approach, setApproach] = useState("");
  const [customGoal, setCustomGoal] = useState("");
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
  const handleFinalSubmit = () => {
    // Example: Convert string-based answers to booleans or arrays if needed

    // calorieViewing is a boolean in UserPreferences
    let calorieViewingBool = false;
    let macroViewingBool = false;
    if (calorieViewing === "Yes, I’d like to see them.") {
      calorieViewingBool = true;
    } else if (calorieViewing === "I’d prefer to see only the calories.") {
      calorieViewingBool = true;
      macroViewingBool = false;
    } else if (calorieViewing === "I’d prefer to see only the macros.") {
      calorieViewingBool = false;
      macroViewingBool = true;
    } else if (calorieViewing === "I don’t want to see them.") {
      macroViewingBool = false;
      calorieViewingBool = false;
    }

    // moodCheckIn is a boolean in UserPreferences
    let moodCheckInBool = false;
    if (moodCheckIn === "Yes, definitely.") {
      moodCheckInBool = true;
    } else if (moodCheckIn === "Maybe, but not sure.") {
      moodCheckInBool = false;
    } else if (moodCheckIn === "No, I’d rather keep it simple.") {
      moodCheckInBool = false;
    }

    // If "Other" was chosen for dietPreferences, and customDiet is not empty,
    // you might want to push it into the dietaryPreferences array:
    const finalDietaryPreferences = [...dietPreferences];
    const finalCustomDietaryPreferences: string[] = [];
    if (dietPreferences.includes("Other") && customDiet.trim()) {
      // Option A: Put the user’s custom input in a separate array
      finalCustomDietaryPreferences.push(customDiet.trim());
    }

    // Hide meal tracking logic (optional)
    // e.g. set hideMealTracking to true if user isn't comfortable with meal logging
    let hideMealTrackingBool = false;
    if (mealLoggingComfort === "I’m not comfortable logging meals.") {
      hideMealTrackingBool = true;
    }

    // Combine customGoals if “Other” is selected:
    let finalGoals = [...primaryGoals];
    if (primaryGoals.includes("Other") && customGoal.trim()) {
      finalGoals.push(customGoal.trim());
    }

    // Finally, call updatePreferences with the merged data
    updatePreferences({
      dietaryPreferences: finalDietaryPreferences,
      customDietaryPreferences: customDiet ? [customDiet.trim()] : [],
      mealLogging: mealLoggingComfort,
      hideMealTracking: hideMealTrackingBool,
      macroViewing: macroViewingBool,
      calorieViewing: calorieViewingBool,
      physicalHealth,
      customMedicalConditions,
      customMentalHealthConditions: customDisorder,
      foodAnxiety: anxiousFood,
      triggerWarnings: hideTriggers,
      remindersFrequency,
      approach,
      primaryGoals: finalGoals,
      moodCheckIn: moodCheckInBool,
      // For mental health support
      mentalHealthSupport: mentalHealthResouces,
    });

    // Navigate to your next screen, e.g. the home screen:
    // router.replace('/(tabs)/home');
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
              <Text style={styles.sectionTitle}>
                1. Dietary Preferences/Restrictions
              </Text>
              <Text style={styles.question}>
                Do you have any dietary preferences or restrictions? (Select all
                that apply)
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
                      dietPreferences.includes(option) && styles.selectedOption,
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
                  "Yes, I’m okay with logging (including approximate calories or macros).",
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
                Would you want to see the calories or macros for your meals?
              </Text>
              <View style={styles.optionContainer}>
                {[
                  "Yes, I’d like to see them.",
                  "I’d prefer to see only the calories.",
                  "I’d prefer to see only the macros.",
                  "I don’t want to see them.",
                ].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      calorieViewing === option && styles.selectedOption,
                    ]}
                    onPress={() => setCalorieViewing(option)}
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
          </>
        );
      case 1:
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
              <View>
                <Text style={styles.question}>
                  Do you have any medical conditions or injuries that might
                  affect exercise choices?
                </Text>
                <View style={styles.optionContainer}>
                  {["Yes", "No", "Prefer not to say"].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        medicalConditions === option && styles.selectedOption,
                      ]}
                      onPress={() => setMedicalConditions(option)}
                    >
                      <Text>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {medicalConditions.includes("Yes") && (
                  <TextInput
                    style={styles.input}
                    placeholder="Please specify"
                    value={customMedicalConditions}
                    onChangeText={setCustomMedicalConditions}
                  />
                )}
              </View>
              <Text style={styles.sectionTitle}>
                2.2 Mental Health & Emotional State (Opt-In)
              </Text>
              <View>
                <Text style={styles.question}>
                  Have you ever been diagnosed with (or do you suspect) any of
                  the following?
                </Text>
                <View style={styles.optionContainer}>
                  {[
                    "Depression",
                    "Anxiety",
                    "Bipolar Disorder",
                    "Post-Traumatic Stress Disorder (PTSD)",
                    "Eating Disorder",
                    "Obsessive-Compulsive Disorder (OCD)",
                    "None of the above",
                    "Prefer not to say",
                    "Other",
                  ].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        mentalDisorder === option && styles.selectedOption,
                      ]}
                      onPress={() => setMentalDisorder(option)}
                    >
                      <Text>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {mentalDisorder.includes("Other") && (
                  <TextInput
                    style={styles.input}
                    placeholder="Please specify"
                    value={customDisorder}
                    onChangeText={setCustomDisorder}
                  />
                )}
              </View>
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
                        anxiousFood === option && styles.selectedOption,
                      ]}
                      onPress={() => setAnxiousFood(option)}
                    >
                      <Text>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text style={styles.question}>
                  Would you like us to adjust the app to minimize triggers (for
                  example, hiding calorie counts, providing gentle prompts
                  instead of strict daily targets)?
                </Text>
                <View style={styles.optionContainer}>
                  {[
                    "Yes, please hide numeric data when possible.",
                    " I’m okay with seeing all data.",
                    "I’m not sure, let me decide later in Settings.",
                  ].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        hideTriggers === option && styles.selectedOption,
                      ]}
                      onPress={() => setHideTriggers(option)}
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
                        remindersFrequency.includes(option) &&
                          styles.selectedOption,
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
                      onPress={() => setmentalHealthResouces(option)}
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

              {/* 4.1 Consent to Store and Use Data */}
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

              {/* 4.2 Confirmation of Non-Clinical Service */}
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

              <Button
                mode="contained"
                textColor="#390a84"
                theme={{ colors: { primary: "#C3B1E1" } }}
                onPress={() => {
                  // Only submit if data consent is given; otherwise, do nothing or exit.
                  if (dataConsent) {
                    handleFinalSubmit();
                  } else {
                    alert("You must agree to the data use policy to continue.");
                  }
                }}
              >
                Submit
              </Button>
              <View style={styles.navigationButtons}>
                <Button
                  mode="contained"
                  textColor="#390a84"
                  theme={{ colors: { primary: "#C3B1E1" } }}
                  onPress={handleBack}
                >
                  Back
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
