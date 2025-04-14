import React, { act, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { ProgressBar } from "react-native-paper";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useUserPreferences } from "../../context/userPreferences";
import { useRouter } from "expo-router";
import { auth } from "../../config/firebaseConfig"; // ← Required for currentUser
import { markQuizComplete } from "@/utils/asyncStorage";
import { markQuizCompletedInFirestore } from "../../utils/firestore";
export default function BasicQuiz() {
  const { updatePreferences, userPreferences } = useUserPreferences();
  const [step, setStep] = useState(0);
  const router = useRouter();
  const [error, setError] = useState("");
  const [goalError, setGoalError] = useState("");

  // Other state variables...
  const [medicalConditionsInput, setMedicalConditionsInput] = useState(""); // User enters comma-separated conditions
  const [primaryGoals, setPrimaryGoals] = useState<string[]>([]);
  const [name, setName] = useState(userPreferences.name);
  const [ageGroup, setAgeGroup] = useState(userPreferences.ageGroup);
  const [activityLevel, setactivityLevel] = useState(
    userPreferences.activityLevel
  );
  const [medicalConditions, setMedicalConditions] = useState("");

  const [mentalDisorder, setMentalDisorder] = useState<string[]>(
    userPreferences.mentalHealthConditions || []
  );
  
  const [customDisorder, setCustomDisorder] = useState(
    userPreferences.customMentalHealthConditions || ""
  );
  const [customMedicalConditions, setCustomMedicalConditions] = useState(
    userPreferences.customMedicalConditions || ""
  );
  
  const handleSubmit = () => {
    if (!name.trim()) {
      setError("This field is required.");
      return;
    }

    // Proceed with form submission
    console.log("Submitted value:", name);
    handleNext();
  };

  let finalMedicalConditions: string[] = [];
  if (medicalConditions === "Yes" && customMedicalConditions.trim()) {
    finalMedicalConditions.push(customMedicalConditions.trim());
  } else if (medicalConditions === "No") {
    finalMedicalConditions = ["None"];
  } else if (medicalConditions === "Prefer not to say") {
    finalMedicalConditions = ["Prefer not to say"];
  }
  let finalMentalHealthConditions: string[] = [];
  if (
    !mentalDisorder.includes("None of the above") &&
    !mentalDisorder.includes("Prefer not to say") &&
    mentalDisorder
  ) {
    finalMentalHealthConditions.push(mentalDisorder.join(", "));
  }
  
  // If user typed a customDisorder:
  if (mentalDisorder.includes("Other") && customDisorder.trim()) {
    finalMentalHealthConditions.push(customDisorder.trim());
  }

  const handleNext = () => {
    if (!name.trim()) {
      setError("This field is required.");
      return;
    }

    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => (prev > 0 ? prev - 1 : prev));
  };
  const totalSteps = 2;
  const progress = (step + 1) / totalSteps;
  const resetForm = () => {
    setName("");
    setAgeGroup("");
    setactivityLevel("");
    setMedicalConditions("");
    setCustomMedicalConditions("");
    setMentalDisorder([]);
    setCustomDisorder("");
    setPrimaryGoals([]);
  };
  
  const handleSubmitForm = async () => {
    if (primaryGoals.length === 0) {
      setGoalError("Please select at least one goal.");
      return;
    } else {
      setGoalError("");
    }

    // Parse the comma-separated input into an array
    const medicalConditionsArray = medicalConditionsInput
      .split(",")
      .map((cond) => cond.trim())
      .filter((cond) => cond !== "");

    const newPrefs = {
      name,
      ageGroup,
      activityLevel:activityLevel ?? "",
      medicalConditions: finalMedicalConditions,
      mentalHealthConditions: finalMentalHealthConditions,
      customMentalHealthConditions: customDisorder,
      customMedicalConditions: customMedicalConditions,
      primaryGoals: primaryGoals,
    };

    updatePreferences({
      ...newPrefs,  
    });

    console.log("🔁 Updating preferences in context:", newPrefs);
    const currentUser = auth.currentUser;
    if (currentUser) {
      const { saveUserPreferences } = await import("../../utils/firestore");
    
      await saveUserPreferences(currentUser.uid, {

        ...userPreferences,
        ...newPrefs,
      });
    
      await markQuizCompletedInFirestore(currentUser.uid);
    
      console.log("✅ Quiz complete for:", currentUser.uid);
      console.log("✅ Firestore quiz completion marked");
      router.replace("/dashboard"); 
    } else {
      console.warn("⚠️ No current user found during quiz submit");
    }
  };    
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>

            <SafeAreaView>
              
              <View style={{ marginBottom: 20, marginTop:20 }}>
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
              <Text style={styles.sectionTitle}>Let's get to know you✨</Text>
              <Text style={styles.question}>
                What’s your name or preferred display name?
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (text.trim()) {
                    setError("");
                  }
                }}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <Text style={styles.question}>What is your age group?</Text>
              <View style={styles.optionContainer}>
                {[
                  "Under 18",
                  "18–25",
                  "26–40",
                  "41–55",
                  "56+",
                  "Prefer not to say",
                ].map((group) => (
                  <TouchableOpacity
                    key={group}
                    style={[
                      styles.optionButton,
                      ageGroup === group && styles.selectedOption,
                    ]}
                    onPress={() => setAgeGroup(group)}
                  >
                    <Text>{group}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.question}>
                What is your current activity level?
              </Text>
              <View style={styles.optionContainer}>
                {[
                  "Sedentary (little or no exercise)",
                  "Lightly active (1–3 days/week)",
                  "Moderately active (3–5 days/week)",
                  "Very active (6–7 days/week)",
                  "Prefer not to say",
                ].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.optionButton,
                      activityLevel === level && styles.selectedOption,
                    ]}
                    onPress={() => setactivityLevel(level)}
                  >
                    <Text>{level}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.question}>
                Do you have any medical conditions or injuries that might affect
                exercise choices?
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
              <Text style={styles.question}>Mental Health Conditions</Text>
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
                      mentalDisorder.includes(option) && styles.selectedOption,
                    ]}
                    onPress={() =>
                      setMentalDisorder((prev) =>
                        prev.includes(option)
                          ? prev.filter((item) => item !== option)
                          : [...prev, option]
                      )
                    }
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
              <View style={styles.navigationButtons}>
                <Button
                  mode="contained"
                  onPress={handleNext}
                  textColor="#390a84"
                  style={{ marginRight: 10, left: 250 }}
                  theme={{ colors: { primary: "#C3B1E1" } }}
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
            <Text style={styles.sectionTitle}>Personal Goals</Text>
            <Text style={styles.question}>
              What are your primary reasons for using this app? (Select up to 3)
            </Text>
            <View style={styles.optionContainer}>
              {goalError ? (
                <Text style={{ color: "red", marginBottom: 10 }}>
                  {goalError}
                </Text>
              ) : null}
              {[
                "General fitness/health",
                "Weight management or body recomposition",
                "Improve mental well-being",
                "Build consistent eating habits",
                "Enhance social connections or community support",
                "Learn about nutrition and healthy eating",
                "Track progress and set goals",
                "Improve mindfulness or self-care habits",
              ].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    primaryGoals.includes(option) && styles.selectedOption,
                  ]}
                  onPress={() =>
                    setPrimaryGoals((prev) =>
                      prev.includes(option)
                        ? prev.filter((g) => g !== option)
                        : prev.length < 3
                        ? [...prev, option]
                        : prev
                    )
                  }
                >
                  <View style={styles.optionContent}>
                    <Text style={styles.optionText}>{option}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.navigationButtons}>
              <Button
                mode="contained"
                onPress={handleBack}
                textColor="#390a84"
                style={{ marginRight: 10 }}
                theme={{ colors: { primary: "#C3B1E1" } }}
              >
                Back
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmitForm}
                textColor="#390a84"
                theme={{ colors: { primary: "#C3B1E1" } }}
              >
                Submit
              </Button>
            </View>
          </>
        );

      default:
        return <Text>Unknown Step</Text>;
    }
  };

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
      fontSize: 40,
      fontWeight: "bold",
      marginBottom: 0,
      fontFamily: "PatrickHand-Regular",
    },
    question: {
      // fontFamily: "Comfortaa-Regular",
      fontSize: 18,
      marginVertical: 10,
      marginBottom: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: "#e8dcdc",
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
    },
    optionContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 15,
    },
    optionContent: {
      flexDirection: "row",
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
      // alignItems: "center",
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

    selectedConsentButton: {
      color: "#390a84",
      backgroundColor: "#C3B1E1",
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView style={styles.section}>{renderStep()}</SafeAreaView>
    </ScrollView>
  );
}
